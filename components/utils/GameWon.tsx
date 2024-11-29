import { useEffect } from "react";
import { doc, increment, updateDoc } from "firebase/firestore";
import confetti from "canvas-confetti";
import { auth, db } from "@/app/firebase"; // Make sure you import your Firebase auth and db

const ShortConfettiAnimation = () => {
  useEffect(() => {
    // Only run the animation if the user is authenticated
    const user = auth.currentUser; // Get the currently authenticated user
    if (!user) {
      console.log("No user logged in");
      return; // Exit if no user is logged in
    }

    var duration = 3.5 * 1000; // 3.5 seconds in milliseconds
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }; // Set a high zIndex

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Adjust the frequency of the particles for smoother animation
    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval); // Stop animation after 3.5 seconds
      }

      // Increase particle count for more visual impact
      var particleCount = 75 * (timeLeft / duration); // Adjust particle count (increased)

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
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          wins: increment(0.5), // Set wins to 1 or increment it (use Firebase's increment function for incremental updates)
        });
        console.log("Wins updated successfully");
      } catch (error) {
        console.error("Error updating wins: ", error);
      }
    };

    // Call updateWins to add 1 to the wins field
    updateWins();

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once after component mounts

  return <div></div>;
};

export default ShortConfettiAnimation;
