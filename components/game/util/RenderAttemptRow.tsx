import React from "react";
import styles from "../games.module.css";
import LetterComponent from "@/components/utils/LetterProps";
import { motion } from "framer-motion";

// renderAttempt properties & page context
import { IRenderAttempRowProps } from "@/interface";
import { useAppContext } from "@/context/AppContext";

const RenderAttemptRow = React.memo(
  ({ attemptIndex, prevList, close, length }: IRenderAttempRowProps) => {
    const attemptData = prevList[attemptIndex];
    const { wordLength, mode } = useAppContext();
    return (
      <div key={`attempt-${attemptIndex}`} className={styles.attempt}>
        {!attemptData
          ? Array.from({ length: 4 }).map((_, a) => (
              <motion.div
                key={`empty-${attemptIndex}-${a}`}
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
              />
            ))}
      </div>
    );
  }
);

export default RenderAttemptRow;
