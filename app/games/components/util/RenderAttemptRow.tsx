import LetterComponent from "../game/props/LetterProps";
import { motion } from "framer-motion";
import styles from "../game/game.module.css";
import React from "react";
import { useDoubleTroubleContext } from "../../context/AppContext";
import { IRenderAttempRowProps } from "@/interface";
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
  hiddenWord:string
}

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
    const { wordLength } = useDoubleTroubleContext();
    console.log()
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
  const { wordLength, mode } = useDoubleTroubleContext();
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
