import React from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../../popups/popups.module.css"; // Import your styles here

interface WordLettersProps {
  word: string;
}

const WordLetters: React.FC<WordLettersProps> = ({ word }) => {
  return (
    <div className={styles.hiddenWord}>
      {word.split("").map((letter) => (
        <p key={uuidv4()} className={styles.eachLetter}>
          {letter}
        </p>
      ))}
    </div>
  );
};

export default WordLetters;
