import React, { memo, useEffect, useState } from "react";

import styles from "../../game.module.css";

import { IKeyProps, ILetterData } from "@/interface";
import { useAppContext } from "@/context/AppContext";

const Key: React.FC<IKeyProps> = memo(
  ({ per_key, setIsClick, dispatch, state, setLength }) => {
    const { wordLength, mode } = useAppContext();

    const [result, setResult] = useState<ILetterData | undefined>(undefined);

    useEffect(() => {
      const searchForALetter = state.checkedLetters.find(
        (i) => i.perLetter.toLowerCase() === per_key.toLowerCase()
      );
      setResult(searchForALetter || undefined);
    }, [state.checkedLetters, per_key]);

    const getClassName = (): string => {
      if (!result) return styles.key;
      if (result.isCorrect) return `${styles.key} ${styles.correctLetter}`;
      if (result.isOccured) return `${styles.key} ${styles.occuredLetter}`;
      return `${styles.key} ${styles.incorrectLetter}`;
    };

    const handleKeyPress = () => {
      setIsClick(per_key);

      if (state.length.length < wordLength && state.text !== "won! 🏆") {
        setLength((length) => length + per_key);
      }
    };

    return (
      <button
        onClick={handleKeyPress}
        style={{
          transition: `background-color 0.3s ease ${
            Math.random() * 0.5
          }s, 0.3s ease ${Math.random() * 0.5}s`,
          backgroundColor: result?.isCorrect
            ? "#6aaa64"
            : result?.isOccured
            ? "#c9b458"
            : result
            ? "#787c7e"
            : mode === false
            ? "#7a858d"
            : "#d1d7de",
          color: result ? "#fff" : "#000",
        }}
        className={getClassName()}
      >
        <span style={mode === false ? { color: "#fff" } : undefined}>
          {per_key ? per_key : undefined}
        </span>
      </button>
    );
  }
);

export default Key;
