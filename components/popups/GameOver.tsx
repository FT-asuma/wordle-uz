import React, { useEffect, useState } from "react";
import styles from "./popups.module.css";
import ShortConfettiAnimation from "../utils/gameOver/GameWon";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useAppContext } from "@/context/AppContext";
import { IGameOverProps } from "@/interface";
import renderHiddenWord from "./util/renderHiddenWord";

const GameOver: React.FC<IGameOverProps> = ({
  text,
  setText,
  modalOpen,
  setModalOpen,
  gameWon,
  setGameWon,
  setPrevList,
}: IGameOverProps) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const { hiddenWord, listOfWords, setHiddenWord, randomWord } =
    useAppContext();

  console.log(modalOpen);
  const resetGame = () => {
    setModalOpen(false);
    setPrevList([]);
    setTimeout(() => {
      const newHiddenWords = Array.isArray(hiddenWord)
        ? [
            randomWord(listOfWords, 1, listOfWords.length),
            randomWord(listOfWords, 1, listOfWords.length),
          ]
        : randomWord(listOfWords, 1, listOfWords.length);
      // @ts-ignore
      setHiddenWord(newHiddenWords);
    }, 300);
    setText("");
    setGameWon(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  useEffect(() => {
    document.body.style.overflow = gameWon ? "hidden" : "";
  }, [gameWon]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (modalOpen === true && event.key === "Enter") {
        resetGame();
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [modalOpen]);
  return (
    <div
      className={styles.gameover}
      style={{
        opacity: modalOpen ? 1 : 0,
        transition: "0.3s",
        zIndex: modalOpen ? 100 : -100,
      }}
      aria-hidden={!modalOpen}
    >
      {gameWon && <ShortConfettiAnimation gameWon={gameWon} />}
      <div className={styles.modalCont}>
        <div className={styles.title}>
          <span />
          <h3>You {text}</h3>
          <button
            onClick={() => {
              setModalOpen(false);
              setGameWon(false);
            }}
          >
            <AiOutlineClose color="#fff" fontSize={24} />
          </button>
        </div>
        <div className={styles.list}>
          <p>
            The answer{Array.isArray(hiddenWord) ? "s" : ""}{" "}
            {Array.isArray(hiddenWord) ? "were" : "was"}:
          </p>
          {renderHiddenWord(hiddenWord)}
          <button onClick={resetGame}>New game</button>
          <p>
            Or press <code>Enter</code> to play again
          </p>
          <span>Other options</span>
          <button className={styles.share} onClick={copyToClipboard}>
            Share with friends
          </button>
          {linkCopied && (
            <div className={styles.linkCopiedMessage}>
              <FaCheckCircle color="#28a745" size={16} />
              <span>Link copied!</span>
            </div>
          )}
        </div>
      </div>
      <div onClick={resetGame} className={styles.bg} />
    </div>
  );
};

export default GameOver;