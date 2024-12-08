"use client";
import { useState } from "react";

import styles from "../game/games.module.css";

// framer-motion
import { motion } from "framer-motion";

import { ILetterProps } from "@/interface";

const LetterComponent: React.FC<ILetterProps> = ({ a, i, lengthOfWord }) => {
  const [bgClass, setBgClass] = useState<string>("");
  const getBackgroundClass = () => {
    if (i.isCorrect) return styles.correctLetter;
    if (i.isOccured) return styles.occuredLetter;
    return styles.incorrectLetter;
  };

  return (
    <motion.div
      key={a}
      data-key={a}
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
      className={`${styles.letterCont} ${bgClass}`}
      initial={{ rotateX: 0 }}
      animate={{ rotateX: 360 }}
      onAnimationComplete={() => setBgClass(getBackgroundClass())}
      transition={{
        duration: 0.6,
        delay: a * 0.3,
        ease: "easeInOut",
        repeat: 0,
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
