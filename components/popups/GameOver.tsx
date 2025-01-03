"use client"
import React, { useEffect, useState } from "react";

import styles from "./popups.module.css";

import { ShortConfettiAnimation } from "../utils/";
import renderHiddenWord from "./util/renderHiddenWord";

import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import { useAppContext } from "@/context/AppContext";
import { IGameOverProps } from "@/interface";

const GameOver: React.FC<IGameOverProps> = ({ state, dispatch }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const { hiddenWord, listOfWords, setHiddenWord, randomWord } =
    useAppContext();

  const resetGame = () => {
    dispatch({ type: "RESET_STATE" });
    setTimeout(() => {
      const newHiddenWords = Array.isArray(hiddenWord)
        ? Array(2)
            .fill(null)
            .map(() => randomWord(listOfWords, 1, listOfWords.length))
        : randomWord(listOfWords, 1, listOfWords.length);
      // @ts-ignore
      setHiddenWord(newHiddenWords);
    }, 300);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  useEffect(() => {
    document.body.style.overflow = state.gameWon ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.gameWon]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (state.modalOpen && event.key === "Enter") {
        resetGame();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.modalOpen]);
  return (
    <div
      className={styles.gameover}
      style={{
        opacity: state.modalOpen ? 1 : 0,
        transition: "0.3s",
        zIndex: state.modalOpen ? 100 : -100,
      }}
      aria-hidden={!state.modalOpen}
    >
      {state.gameWon && <ShortConfettiAnimation gameWon={state.gameWon} />}
      <div className={styles.modalCont}>
        <ModalHeader
          title={`You ${state.text}`}
          onClose={() => {
            resetGame();
          }}
        />
        <div className={styles.list}>
          <div style={{ textAlign: "center" }}>
            The answer{Array.isArray(hiddenWord) ? "s" : ""}{" "}
            {Array.isArray(hiddenWord) ? "were" : "was"}:{" "}
            {Array.isArray(hiddenWord)
              ? hiddenWord.join(", ")
              : renderHiddenWord(hiddenWord)}
          </div>
          <button onClick={resetGame}>New game</button>
          <p>
            Or press <code>Enter</code> to play again
          </p>
          <span>Other options</span>
          <button className={styles.share} onClick={copyToClipboard}>
            Share with friends
          </button>
          {linkCopied && <LinkCopiedMessage />}
        </div>
      </div>
      <div onClick={resetGame} className={styles.bg} />
    </div>
  );
};

// Subcomponents
const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({
  title,
  onClose,
}) => (
  <div className={styles.title}>
    <span />
    <h3>{title}</h3>
    <button onClick={onClose}>
      <AiOutlineClose color="#fff" fontSize={24} />
    </button>
  </div>
);

const LinkCopiedMessage = () => (
  <div className={styles.linkCopiedMessage}>
    <FaCheckCircle color="#28a745" size={16} />
    <span>Link copied!</span>
  </div>
);

export default GameOver;
