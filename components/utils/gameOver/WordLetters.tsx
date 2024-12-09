import React from "react";

import styles from "../../popups/popups.module.css";

interface WordLettersProps {
  word: string;
}

const WordLetters: React.FC<WordLettersProps> = ({ word }) => {
  return (
    <div className={styles.hiddenWord}>
      {word.split("").map((letter, index) => (
        <p key={`${letter}-${index}`} className={styles.eachLetter}>
          {letter}
        </p>
      ))}
    </div>
  );
};
export default WordLetters;