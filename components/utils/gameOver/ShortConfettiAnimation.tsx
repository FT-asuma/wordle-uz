"use client"

import { useEffect } from "react";

import { auth, db } from "@/app/firebase";
import { useAppContext } from "@/context/AppContext";

import { doc, increment, updateDoc } from "firebase/firestore";
import confetti from "canvas-confetti";

const ShortConfettiAnimation = ({ gameWon }: { gameWon: boolean }) => {
  const { wordLength } = useAppContext();

  const calculator = () => (wordLength - 2) * 0.4;

  useEffect(() => {
    if (!gameWon) return;

    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
    }

    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval); 
      }

      const particleCount = 75 * (timeLeft / duration); 

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
    }, 150);

    const updateWins = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            wins: increment(calculator()),
          });
          console.log("Wins updated successfully");
        } catch (error) {
          console.error("Error updating wins: ", error);
        }
      }
    };

    updateWins();

    return () => clearInterval(interval);
  }, [gameWon]);

  return null;
};
export default ShortConfettiAnimation;