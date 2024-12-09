"use client";
import { useState } from "react";

import styles from "../game/games.module.css";

import { motion } from "framer-motion";

import { ILetterData, ILetterProps } from "@/interface";
import { useAppContext } from "@/context/AppContext";

const LetterComponent: React.FC<ILetterProps> = ({ a, i }) => {
  const [bgClass, setBgClass] = useState<string>("");
  const {wordLength} = useAppContext()
  const getBackgroundClass = () => {
    if (i.isCorrect) return styles.correctLetter;
    if (i.isOccured) return styles.occuredLetter;
    return styles.incorrectLetter;
  };
  const getCountInWord = (item: ILetterData) => {
    return item.countInWord &&
      ((item.isCorrect && item.countInWord >= 1) ||
        (!item.isCorrect && item.countInWord > 1))
      ? item.countInWord
      : "";
  };

  return (
    <motion.div
      key={a}
      data-key={a}
      style={{
        width:
          wordLength < 10
            ? 56
            : wordLength === 10
            ? 54
            : wordLength === 11
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
          {getCountInWord(i)}
        </sup>
      </span>
    </motion.div>
  );
};
export default LetterComponent;