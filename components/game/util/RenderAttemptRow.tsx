import LetterComponent from "@/components/utils/LetterProps";
import { motion } from "framer-motion";
import styles from "../games.module.css";
import React from "react";
interface LetterData {
  isCorrect: boolean;
  isOccured: boolean;
  perLetter: string;
  countInWord?: number | undefined;
}

interface AttemptData {
  prev: LetterData[]; // Array of letter data for the attempt
}

interface Props {
  attemptIndex: number; // Index of the current attempt
  prevList: AttemptData[]; // Array of previous attempts
  lengthOfWord: string[]; // Array representing the length of the word (e.g., underscores or letters)
  close: number | null; // Index of the current attempt being guessed
  length?: string; // Array of guessed letters
  mode: boolean; // True for dark mode, false for light mode
}

const RenderAttemptRow = React.memo(
  ({ attemptIndex, prevList, lengthOfWord, close, length, mode }: Props) => {
    const attemptData = prevList[attemptIndex];
    const isAttemptEmpty = !attemptData;
    const shouldRenderEmptyAttempt = isAttemptEmpty;

    return (
      <div key={`attempt-${attemptIndex}`} className={styles.attempt}>
        {shouldRenderEmptyAttempt
          ? lengthOfWord.map((_, a) => (
              <motion.div
                key={`empty-${attemptIndex}-${a}`}
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
                className={styles.letterCont}
                initial={{ scale: 1 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <motion.span
                  style={mode === true ? { color: "#2e3239" } : {}}
                  className={styles.letter}
                >
                  {close === attemptIndex
                    ? length?.[a]?.toLocaleUpperCase() || ""
                    : ""}
                </motion.span>
              </motion.div>
            ))
          : attemptData.prev.map((i, a) => (
              <LetterComponent
                key={`letter-${attemptIndex}-${a}`}
                a={a}
                i={i}
                lengthOfWord={lengthOfWord}
              />
            ))}
      </div>
    );
  }
);

export default RenderAttemptRow;
