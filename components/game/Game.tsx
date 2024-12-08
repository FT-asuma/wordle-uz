"use client";

import React, { useEffect, useRef, useState } from "react";

import styles from "./games.module.css";

// components
import Keyboard from "./Keyboard";
import { GameOver, Alert } from "../popups";
import { RenderAttemptRow } from "./util";

// context & interface & constant
import { useAppContext } from "@/context/AppContext";
import {
  IGameOverProps,
  IKeyboardProps,
  ILetterData,
  IRenderAttempRowProps,
} from "@/interface";
import { ALPHABET } from "@/constants";

interface IPrevList {
  prev: [ILetterData];
}

const Game: React.FC<IPrevList> = () => {
  const { wordLength, mode, listOfWords, lengthOfWord, hiddenWord, swap } =
    useAppContext();

  const [length, setLength] = useState<string>("");
  const [prevList, setPrevList] = useState<IPrevList[]>([]);
  const [close, setClose] = useState(0);
  const [animate, setAnimate] = useState(0);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | any>(null);
  const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);
  const [checkedLetters, setCheckedLetters] = useState<ILetterData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState<string>("win");
  const [gameWon, setGameWon] = useState(false);
  const [dimension, setDimension] = useState<{
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (dimension)
      setDimension({ width: window.innerWidth, height: window.innerHeight });

    const focusTextarea = () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };
    document.addEventListener("click", focusTextarea);
    document.addEventListener("keydown", focusTextarea);

    return () => {
      document.removeEventListener("click", focusTextarea);
      document.removeEventListener("keydown", focusTextarea);
    };
  }, [dimension]);

  useEffect(() => {
    if (hiddenWord) {
      setPrevList([]);
      setClose(0);
      textareaRef.current.disabled = false;
      setCheckedLetters([]);
    }
  }, [hiddenWord]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        checkEachLetter(length);
      }
    };
    if (isEnterPressed === true) {
      checkEachLetter(length);
    }

    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [isEnterPressed, length]);
  useEffect(() => {
    if (prevList.length === 6) {
      if (modalOpen === false) {
        setModalOpen(true);
        setText("lost!");
      }
    }

    if (prevList.length > 0) {
      const getUniqueLetters = (attempts: any) => {
        const seen = new Set();
        return attempts.flatMap((attempt: any) =>
          attempt.prev.filter((letterObj: any) => {
            if (!seen.has(letterObj.perLetter)) {
              seen.add(letterObj.perLetter);
              return true;
            }
            return false;
          })
        );
      };

      setCheckedLetters(getUniqueLetters(prevList));
    }
  }, [prevList, modalOpen]);

  // checking the word/letters

  const checkEachLetter = (word: string) => {
    if (word?.length === wordLength) {
      const pend = listOfWords.find(
        (c) => c.toLocaleLowerCase() === word.toLocaleLowerCase()
      );
      if (pend !== undefined) {
        if (pend === hiddenWord) {
          checkWord(hiddenWord, pend);
          textareaRef.current.disabled = true;
          setModalOpen(true);
          setText("won! 🏆");
          setGameWon(true);
        } else {
          if (pend) {
            checkWord(hiddenWord as string, pend);
          }
        }
      } else {
        if (modalOpen !== true) {
          setError("Word not found");
          setTimeout(() => {
            setError("");
          }, 700);
        }
      }
    } else {
      if (
        word?.length < wordLength &&
        modalOpen !== true &&
        prevList.length !== 6
      ) {
        setError("Word is short");
        setTimeout(() => {
          setError("");
        }, 700);
      }
    }
    setIsEnterPressed(false);
  };
  const checkWord = (hiddenWord: string, enteredWord: string) => {
    const entered = [];
    const previous: any = { prev: [] };
    const letterCount: any = {};

    // Count letters in the hidden word
    hiddenWord.split("").forEach((letter) => {
      letterCount[letter.toLowerCase()] =
        (letterCount[letter.toLowerCase()] || 0) + 1;
    });

    // First pass - check for exact matches
    enteredWord.split("").forEach((letter, i) => {
      const lowerLetter = letter.toLowerCase();
      const isCorrect = hiddenWord[i].toLocaleLowerCase() === lowerLetter;

      if (isCorrect) {
        letterCount[lowerLetter]--;
        entered.push(letter); // Adding letter without index
        previous.prev.push({
          isCorrect: true,
          perLetter: letter,
          countInWord: letterCount[lowerLetter], // Add count of the letter
          isOccured: false,
        });
      } else {
        entered.push(null);
        previous.prev.push({
          isCorrect: false,
          perLetter: letter,
          countInWord: letterCount[lowerLetter], // Add count of the letter
          isOccured: false,
        });
      }
    });

    // Second pass - check for non-exact matches and update occurrence
    enteredWord.split("").forEach((letter, i) => {
      const lowerLetter = letter.toLowerCase();
      if (!previous.prev[i].isCorrect && letterCount[lowerLetter] > 0) {
        letterCount[lowerLetter]--;
        previous.prev[i].isOccured = true;
      }
    });

    setPrevList((prev) => [...prev, previous]);
    setClose(close + 1);
    setAnimate(animate + 1);
    setLength("");
  };

  const saveUserTextHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const listOfLetters = e.currentTarget.value.split("");
    const res: string[] = [];
    listOfLetters.map((l) => {
      const a = ALPHABET.find(
        (c) => c.toLocaleLowerCase() === l.toLocaleLowerCase()
      );
      if (a !== undefined) {
        res.push(a);
      }
    });
    setLength(res.join("").trim());
  };

  const renderGameStatus = () => {
    if (prevList?.length > 0) {
      switch (text) {
        case "won! 🏆":
          return <p className={styles.reward}>You Won! 🏆</p>;
        case "lost!":
          return <p className={styles.reward}>You lost!</p>;
        default:
          return null;
      }
    }
    return <p style={{ height: 28 }}></p>;
  };

  // props~

  const gameOverProps: IGameOverProps = {
    setText,
    text,
    modalOpen,
    setModalOpen,
    gameWon,
    setGameWon,
    setPrevList,
  };

  const keyboardProps: IKeyboardProps = {
    checkedLetters,
    length,
    setIsEnterPressed,
    setLength,
    text,
    textareaRef,
  };

  return (
    <section className={mode === false ? styles.game : styles.lightMode}>
      <textarea
        ref={textareaRef}
        style={{ position: "fixed", zIndex: -1, opacity: 0 }}
        maxLength={wordLength}
        value={length}
        onChange={saveUserTextHandler}
      />
      <Alert value={error} />
      <GameOver {...gameOverProps} />
      <div className={styles.attempts}>
        {Array.from({ length: 6 }).map((_, attemptIndex) => {
          const attemptProps = {
            key: `row-${attemptIndex}`,
            attemptIndex,
            prevList,
            close,
            length,
          };
          return <RenderAttemptRow {...attemptProps} />;
        })}
      </div>
      {renderGameStatus()}
      <Keyboard {...keyboardProps} />
    </section>
  );
};

export default Game;
