import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const ShortConfettiAnimation = () => {
  const [winCount, setWinCount] = useState<number>(0);
  useEffect(() => {
    const storedWinCount = localStorage.getItem("winCount");
    if (storedWinCount) {
      setWinCount(Number(storedWinCount));
    } else {
      setWinCount(1);
      localStorage.setItem("winCount", String(winCount));
    }

    var duration = 3.5 * 1000; // 1.5 seconds in milliseconds
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }; // Set a high zIndex

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Adjust the frequency of the particles for smoother animation
    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval); // Stop animation after 1.5 seconds
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

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  return <div></div>;
};

export default ShortConfettiAnimation;
