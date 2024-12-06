"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import styles from "../game.module.css";

interface LetterProps {
  a: number; // Index for the letter
  i: {
    isCorrect: boolean;
    isOccured: boolean;
    perLetter: string;
    countInWord?: number;
  };
  lengthOfWord: string[]; // Assuming lengthOfWord is an array of strings
}

const LetterComponent: React.FC<LetterProps> = ({ a, i, lengthOfWord }) => {
  const [bgClass, setBgClass] = useState<string>(""); // To store background class

  // Function to get the background class based on letter's correctness
  const getBackgroundClass = () => {
    if (i.isCorrect) return styles.correctLetter; // Correct letter background
    if (i.isOccured) return styles.occuredLetter; // Occurred letter background
    return styles.incorrectLetter; // Incorrect letter background
  };

  return (
    <motion.div
      key={a}
      data-key={a} // Using a custom data attribute for easy targeting
      style={{
        width:
          lengthOfWord.length < 10
            ? 56
            : lengthOfWord.length === 10
            ? 54
            : lengthOfWord.length === 11
            ? 48.5
            : undefined,
      }}
      className={`${styles.letterCont} ${bgClass}`} // Apply the background class here
      initial={{ rotateX: 0 }} // Initial rotation state
      animate={{ rotateX: 360 }} // Final flip
      onAnimationComplete={() => setBgClass(getBackgroundClass())} // Set background after flip
      transition={{
        duration: 0.6,
        delay: a * 0.3, // Staggered animation
        ease: "easeInOut", // Smooth animation
        repeat: 0, // No repetition
      }}
    >
      <span style={{ color: "#e0e1dd" }} className={styles.letter}>
        {i.perLetter.toLocaleUpperCase()}
        <sup>
          {i.countInWord &&
          ((i.isCorrect && i.countInWord >= 1) ||
            (!i.isCorrect && i.countInWord > 1))
            ? i.countInWord
            : ""}
        </sup>
      </span>
    </motion.div>
  );
};

export default LetterComponent;
