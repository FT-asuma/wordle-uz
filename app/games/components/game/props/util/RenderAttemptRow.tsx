import React from "react";

import styles from "../../game.module.css";

import { LetterComponent } from "@/components/utils";

import { IRenderAttempRowProps } from "@/interface";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";

interface EmptySlotProps {
  attemptIndex: number;
  close: number;
  length?: string;
  a: number;
}

// width calculation
const getWidth = (wordLength: number): number | undefined => {
  if (wordLength < 10) return 56;
  if (wordLength === 10) return 54;
  if (wordLength === 11) return 48.5;
  return undefined;
};

const RenderAttemptRow = React.memo(
  ({ attemptIndex, prevList, close, length }: IRenderAttempRowProps) => {
    const attemptData = prevList[attemptIndex];
    const { wordLength } = useAppContext();
    return (
      <div key={`attempt-${attemptIndex}`} className={styles.attempt}>
        {attemptData
          ? attemptData.prev.map((i, a) => (
              <LetterComponent
                key={`letter-${attemptIndex}-${a}`}
                a={a}
                i={i}
              />
            ))
          : Array.from({ length: wordLength }).map((_, a) => (
              <EmptySlot
                key={`slot-${attemptIndex}-${a}`}
                attemptIndex={attemptIndex}
                close={close as number}
                length={length}
                a={a}
              />
            ))}
      </div>
    );
  }
);

const EmptySlot: React.FC<EmptySlotProps> = ({
  attemptIndex,
  close,
  length,
  a,
}) => {
  const { wordLength, mode } = useAppContext();
  return (
    <motion.div
      style={{
        width: getWidth(wordLength),
      }}
      className={styles.letterCont}
      initial={{ scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <motion.span
        style={mode ? { color: "#2e3239" } : undefined}
        className={styles.letter}
      >
        {close === attemptIndex ? length?.[a]?.toLocaleUpperCase() || "" : ""}
      </motion.span>
    </motion.div>
  );
};

export default RenderAttemptRow;
