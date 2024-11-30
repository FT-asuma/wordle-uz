import React, { useEffect, useState, useMemo } from "react";
import { doc, increment, updateDoc } from "firebase/firestore";
import confetti from "canvas-confetti";
import { auth, db } from "@/app/firebase"; // Make sure you import your Firebase auth and db

const ShortConfettiAnimation = ({
  gameWon,
  lengthOfWord,
}: {
  gameWon: boolean;
  lengthOfWord: string[];
}) => {
  // Calculator function based on word length
  const calculator = () => (lengthOfWord.length - 2) * 0.4; // Multiplies length by 0.4
  useEffect(() => {
    // Only run the animation if the user is authenticated and gameWon is true
    if (!gameWon) return;

    const user = auth.currentUser; // Get the currently authenticated user
    if (!user) {
      console.log("No user logged in");
    }

    const duration = 3.5 * 1000; // 3.5 seconds in milliseconds
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    }; // Set a high zIndex

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Adjust the frequency of the particles for smoother animation
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval); // Stop animation after 3.5 seconds
      }

      // Increase particle count for more visual impact
      const particleCount = 75 * (timeLeft / duration); // Adjust particle count (increased)

      // Trigger confetti from two sides with random positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 150); // Keep interval at 150ms for smoother, but faster animation

    // Update the 'wins' field when animation starts
    const updateWins = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            wins: increment(calculator()), // Increment the wins field by 1
          });
          console.log("Wins updated successfully");
        } catch (error) {
          console.error("Error updating wins: ", error);
        }
      }
    };

    // Call updateWins to add 1 to the wins field
    updateWins();

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [gameWon]); // Only run the effect when gameWon changes

  return null; // No UI elements, just trigger animation and update the user's wins
};
export default ShortConfettiAnimation;
