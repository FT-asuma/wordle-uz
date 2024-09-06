"use client";
import styles from "./games.module.css";
import { motion } from "framer-motion";
const Attempt = ({
  list,
  length,
  a,
  close,
  i,
}: {
  list: string[];
  length: string;
  close: number;
  a: number;
  i: {
    perLetter: string;
    isCorrect: boolean;
    isOccured: string;
  };
}) => {
  return (
    <motion.div
      // initial={animate === 1 ? { opacity: 0.75, scale: 0.8 } : {}}
      // animate={animate === 1 ? { opacity: 1, scale: 1 } : {}}
      // transition={animate === 1 ? { duration: 0.5 } : {}}
      key={Math.random() ** 2}
      style={
        list.length < 10
          ? { width: 56 }
          : list.length === 10
          ? { width: 54 }
          : list.length === 11
          ? { width: 48.5 }
          : {}
      }
      className={`${styles.letterCont} ${
        i.isCorrect === true
          ? styles.correctLetter
          : i.isOccured === i.perLetter
          ? styles.occuredLetter
          : styles.incorrectLetter
      }`}
    >
      <span className={styles.letter}>{i.perLetter.toLocaleUpperCase()}</span>
    </motion.div>
  );
};

export default Attempt;
