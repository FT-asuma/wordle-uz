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
  //   useEffect(() => {
  //     if (modalOpen) {
  //       if (keyPress?.key === "Enter") {
  //         setModalOpen(false);
  //         setHiddenWord(randomWord(whichLib, 1, whichLib.length));
  //       }
  //     }
  //   }, [modalOpen]);
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
              setTimeout(() => {
                setHiddenWord(randomWord(whichLib, 1, whichLib.length));
              }, 300);
              setText("");
            }}
          >
            X
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
              setText("")
            }}
          >
            New game
          </button>
          <p>
            or press <code>Enter</code> to play again
          </p>
        </div>
        <h5 style={{ textAlign: "center" }}>
          Please note! In this modal, the key <code>Enter</code> is not
          currently working, i am working on it {" :)"}
        </h5>
        <button
          onClick={() => {
            setText("");
            setModalOpen(false);
          }}
        >
          Fuck you Asim
        </button>
      </div>
      <div
        onClick={() => {
          setText("");
          setModalOpen(false);
        }}
        className={styles.bg}
      />
    </div>
  );
};

export default GameOver;
