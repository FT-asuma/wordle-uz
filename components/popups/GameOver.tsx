import React, { Dispatch, SetStateAction, useEffect } from "react";
import styles from "./popups.module.css";
import Link from "next/link";
const GameOver = ({
  text,
  hiddenWord,
  setText,
  modalOpen,
  setModalOpen,
  setHiddenWord,
  whichLib,
  keyPress,
}: {
  text: string;
  hiddenWord: string;
  setText: Dispatch<SetStateAction<string>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalOpen: boolean;
  setHiddenWord: Dispatch<SetStateAction<string>>;
  whichLib: string[];
  keyPress: KeyboardEvent;
}) => {
  const randomWord = (list: string[], min: number, max: number) => {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return list[random];
  };

  useEffect(() => {
    if (modalOpen === true) {
      if (keyPress.key === "Enter") {
        setModalOpen(false);
        setTimeout(() => {
          setHiddenWord(randomWord(whichLib, 1, whichLib.length));
        }, 300);
        setText("");
      }
    }
  }, [keyPress]);

  return (
    <div
      className={styles.gameover}
      style={
        modalOpen === true
          ? { opacity: 1, transition: "0.3s", zIndex: 1 }
          : { transition: "0.3s", opacity: 0, zIndex: -100 }
      }
    >
      <div className={styles.modalCont}>
        <div className={styles.title}>
          <span />
          <h3>You {text}</h3>
          <button
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                  fill="#ffffff"
                ></path>{" "}
              </g>
            </svg>
          </button>
        </div>
        <div className={styles.list}>
          <p>The anwer was:</p>
          <div className={styles.hiddenWord}>
            {hiddenWord?.split("").map((e) => {
              return (
                <p
                  key={e + Math.random() ** 2 + Math.random() + Math.random()}
                  className={styles.eachLetter}
                >
                  {e}
                </p>
              );
            })}
          </div>
          <Link className={styles.link} href={`/meaning/${hiddenWord}`}>
            what does this word mean?
          </Link>
          <button
            onClick={() => {
              setModalOpen(false);
              setTimeout(() => {
                setHiddenWord(randomWord(whichLib, 1, whichLib.length));
              }, 300);
              setText("");
            }}
          >
            New game
          </button>
          <p>
            or press <code>Enter</code> to play again
          </p>
          <span>Other options</span>
          <button className={styles.share}>Share with friends</button>
        </div>
      </div>
      <div
        onClick={() => {
          setText("");
          setModalOpen(false);
          setTimeout(() => {
            setHiddenWord(randomWord(whichLib, 1, whichLib.length));
          }, 300);
        }}
        className={styles.bg}
      />
    </div>
  );
};

export default GameOver;
