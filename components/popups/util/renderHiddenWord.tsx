import { v4 as uuidv4 } from "uuid";
import WordLetters from "@/components/utils/gameOver/WordLetters";
import Link from "next/link";
import styles from "../popups.module.css";

const renderHiddenWord = (hiddenWord: string | string[]) =>
  typeof hiddenWord === "string" && hiddenWord ? (
    <div key={uuidv4()}>
      <WordLetters word={hiddenWord} />
      <Link
        className={styles.link}
        target="_blank"
        href={`/meaning/${hiddenWord}`}
      >
        What does this word mean?
      </Link>
    </div>
  ) : (
    Array.isArray(hiddenWord) &&
    hiddenWord.map((word, index) => (
      <div key={word + index}>
        <WordLetters word={word} />
        <Link className={styles.link} target="_blank" href={`/meaning/${word}`}>
          What does this word mean?
        </Link>
      </div>
    ))
  );

export default renderHiddenWord;
