import LetterComponent from "@/components/utils/LetterProps";
import { motion } from "framer-motion";
import styles from "../games.module.css";
import React from "react";
import { IRenderAttempRowProps } from "@/interface";

const RenderAttemptRow = React.memo(
  ({ attemptIndex, prevList, lengthOfWord, close, length, mode }: IRenderAttempRowProps) => {
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
