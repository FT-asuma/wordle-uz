import React, { Dispatch, SetStateAction, useEffect } from "react";
import styles from "./popups.module.css";
import Link from "next/link";
import ShortConfettiAnimation from "../utils/GameWon";

const GameOver = ({
  text,
  hiddenWord,
  setText,
  modalOpen,
  setModalOpen,
  setHiddenWord,
  whichLib,
}: {
  text: string;
  hiddenWord: string;
  setText: Dispatch<SetStateAction<string>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalOpen: boolean;
  setHiddenWord: Dispatch<SetStateAction<string>>;
  whichLib: string[];
}) => {
  const randomWord = (list: string[], min: number, max: number) => {
    if (!list || list.length === 0) return "";
    const random = Math.floor(Math.random() * (max - min)) + min;
    return list[random % list.length];
  };

  const resetGame = () => {
    setModalOpen(false);
    setTimeout(() => {
      setHiddenWord(randomWord(whichLib, 1, whichLib.length));
    }, 300);
    setText("");
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (modalOpen && event.key === "Enter") {
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [modalOpen, whichLib, setHiddenWord, setModalOpen, setText]);

  return (
    <div
      className={styles.gameover}
      style={{
        opacity: modalOpen ? 1 : 0,
        transition: "0.3s",
        zIndex: modalOpen ? 1 : -100,
      }}
      aria-hidden={!modalOpen}
      role="dialog"
    >
      {text === "won! 🏆" && <ShortConfettiAnimation/>}
      <div className={styles.modalCont}>
        <div className={styles.title}>
          <span />
          <h3>You {text}</h3>
          <button onClick={() => setModalOpen(false)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                fill="#ffffff"
              ></path>
            </svg>
          </button>
        </div>
        <div className={styles.list}>
          <p>The answer was:</p>
          <div className={styles.hiddenWord}>
            {hiddenWord?.split("").map((e, index) => (
              <p key={`${e}-${index}`} className={styles.eachLetter}>
                {e}
              </p>
            ))}
          </div>
          <Link
            className={styles.link}
            target="_blank"
            href={`/meaning/${hiddenWord}`}
          >
            What does this word mean?
          </Link>
          <button onClick={resetGame}>New game</button>
          <p>
            Or press <code>Enter</code> to play again
          </p>
          <span>Other options</span>
          <button className={styles.share}>Share with friends</button>
        </div>
      </div>
      <div onClick={resetGame} className={styles.bg} />
    </div>
  );
};

export default GameOver;
