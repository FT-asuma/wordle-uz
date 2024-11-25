import React, { memo, useEffect, useState } from "react";
import styles from "../games.module.css";

interface CheckedLetter {
  perLetter: string;
  isCorrect: boolean;
  isOccured: boolean;
}

interface KeyProperties {
  per_key: string;
  letter: KeyboardEvent | null;
  setIsClick: React.Dispatch<React.SetStateAction<string>>;
  isClick: string;
  setLength: React.Dispatch<React.SetStateAction<string>>;
  length: string;
  text: string;
  wordLength: number;
  checkedLetters: CheckedLetter[];
}

const Key = memo(({
  per_key,
  setIsClick,
  isClick,
  setLength,
  length,
  text,
  wordLength,
  checkedLetters,
}: KeyProperties) => {
  const [result, setResult] = useState<CheckedLetter | undefined>(undefined);

  useEffect(() => {
    const searchForALetter = checkedLetters.find(
      (i) => i.perLetter.toLowerCase() === per_key.toLowerCase()
    );
    setResult(searchForALetter || undefined);
  }, [checkedLetters, per_key]);

  const getClassName = (): string => {
    if (!result) return styles.key;
    if (result.isCorrect) return `${styles.key} ${styles.correctLetter}`;
    if (result.isOccured) return `${styles.key} ${styles.occuredLetter}`;
    return `${styles.key} ${styles.incorrectLetter}`;
  };
  return (
    <button
      onClick={() => {
        setIsClick(per_key);
        if (length.length < wordLength && text !== "won! 🏆") {
          setLength(length + per_key);
        }
      }}
      style={
        per_key === isClick
          ? { background: "#78838b", color: "#fff", transition: "0.3s" }
          : { transition: "0.3s" }
      }
      className={getClassName()}
    >
      <span
        style={
          per_key === isClick
            ? { color: "#fff", transition: "1s", lineHeight: 1.1 }
            : { transition: "1s", lineHeight: 1.1 }
        }
      >
        {per_key ? per_key : "~"}
      </span>
    </button>
  );
});

export default Key;
