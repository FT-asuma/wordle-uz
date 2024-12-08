"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./games.module.css";
import Keyboard from "./Keyboard";
import { ALPHABET, LIBRARY_2 } from "@/constants";
import Alert from "../popups/Alert";
import GameOver from "../popups/GameOver";
import RenderAttemptRow from "./util/RenderAttemptRow";
import { useAppContext } from "@/context/AppContext";
import { ILetterData } from "@/interface";
interface IPrevList {
  prev: [ILetterData];
}

const Game: React.FC = () => {
  const {
    wordLength,
    mode,
    listOfWords,
    lengthOfWord,
    hiddenWord,
    setHiddenWord,
    swap,
  } = useAppContext();

  const [length, setLength] = useState<string>("");
  const [prevList, setPrevList] = useState<IPrevList[]>([]);
  const [close, setClose] = useState(0);
  const [animate, setAnimate] = useState(0);
  const [check, setCheck] = useState(false);
  const [key, setKey] = useState<KeyboardEvent>();
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | any>(null);
  const [whichLib, setWhichLib] = useState<string[]>(listOfWords);
  const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);
  const [checkedLetters, setCheckedLetters] = useState<ILetterData[]>([]);
  // console.log(hiddenWord)
  useEffect(() => {
    const focusTextarea = () => {
      if (textareaRef.current) {
        // @ts-ignore
        textareaRef.current.focus();
      }
    };
    document.addEventListener("click", focusTextarea);
    document.addEventListener("keydown", focusTextarea);
    return () => {
      document.removeEventListener("click", focusTextarea);
      document.removeEventListener("keydown", focusTextarea);
    };
  }, []);
  useEffect(() => {
    if (hiddenWord) {
      setWhichLib(listOfWords);
      setPrevList([]);
      setClose(0);
      console.log("working");
      textareaRef.current.disabled = false;
      setCheckedLetters([]);
    }
  }, [hiddenWord]);
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      setKey(e);
    });
  }, [textareaRef]);
  useEffect(() => {
    if (length?.length) {
      setCheck(false);
    }
  }, [length]);

  useEffect(() => {
    if (key) {
      if (key.key === "Enter") {
        setCheck(!check);
        checkEachLetter(length!);
      }
    }
  }, [key]);
  useEffect(() => {
    if (isEnterPressed === true) {
      setCheck(!check);
      checkEachLetter(length!);
    }
  }, [isEnterPressed]);
  useEffect(() => {
    if (prevList.length === 6) {
      if (modalOpen === false) {
        setModalOpen(true);
        setText("lost!");
      }
    }
    if (prevList && prevList.length > 0) {
      const getUniqueLetters = (attempts: any) => {
        const seen = new Set(); // To track already seen letters
        const uniqueLetters: any = [];

        attempts.forEach((attempt: any) => {
          attempt.prev.forEach((letterObj: any) => {
            if (!seen.has(letterObj.perLetter)) {
              seen.add(letterObj.perLetter); // Add to the set if it's not seen yet
              uniqueLetters.push(letterObj); // Add the letter object to the final array
            }
          });
        });

        return uniqueLetters;
      };

      const uniqueLetters = getUniqueLetters(prevList);
      setCheckedLetters(uniqueLetters);
    }
  }, [prevList]);
  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState<string>("win");
  const [gameWon, setGameWon] = useState(false);
  const checkEachLetter = (word: string) => {
    if (word?.length === wordLength) {
      const pend = whichLib.find(
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
            checkWord(hiddenWord, pend);
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
  const checkWord = (hiddenWord2: string, enteredWord: string) => {
    const entered = [];
    const previous: any = { prev: [] };
    const letterCount: any = {};

    // Count letters in the hidden word
    hiddenWord2.split("").forEach((letter) => {
      letterCount[letter.toLowerCase()] =
        (letterCount[letter.toLowerCase()] || 0) + 1;
    });

    // First pass - check for exact matches
    enteredWord.split("").forEach((letter, i) => {
      const lowerLetter = letter.toLowerCase();
      const isCorrect = hiddenWord2[i].toLocaleLowerCase() === lowerLetter;

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

  const [dimension, setDimension] = useState<{
    width: number;
    height: number;
  }>();
  useEffect(() => {
    if (dimension) {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);
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
  if (!listOfWords && !dimension) {
    return <>Loading...</>;
  }
  return (
    <section className={mode === false ? styles.game : styles.lightMode}>
      <textarea
        name=""
        inputMode="none"
        ref={textareaRef}
        style={{ position: "fixed", zIndex: -1, opacity: 0 }}
        cols={0}
        rows={0}
        maxLength={lengthOfWord.length}
        value={length}
        onChange={(e) => {
          saveUserTextHandler(e);
        }}
        id=""
      ></textarea>
      <Alert value={error} type="alert" />
      <GameOver
        setText={setText}
        text={text}
        hiddenWord={hiddenWord}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        gameWon={gameWon}
        setGameWon={setGameWon}
        whichLib={whichLib}
        lengthOfWord={lengthOfWord}
        setHiddenWord={setHiddenWord}
      />
      <div className={styles.attempts}>
        {Array.from({ length: 6 }).map((_, attemptIndex) => (
          <RenderAttemptRow
            key={`row-${attemptIndex}`}
            attemptIndex={attemptIndex}
            prevList={prevList}
            lengthOfWord={lengthOfWord}
            close={close}
            length={length}
            mode={mode}
          />
        ))}
      </div>
      {text === "won! 🏆" && prevList?.length > 0 ? (
        <p className={styles.reward}>You Won! 🏆</p>
      ) : text === "lost!" && prevList?.length > 0 ? (
        <p className={styles.reward}>You lost!</p>
      ) : (
        <p style={{ height: 28 }}></p>
      )}
      <Keyboard
        length={length}
        setIsEnterPressed={setIsEnterPressed}
        isEnterPressed={isEnterPressed}
        setLength={setLength}
        text={text}
        wordLength={wordLength}
        textareaRef={textareaRef}
        swap={swap}
        checkedLetters={checkedLetters}
        mode={mode}
      />
    </section>
  );
};

export default Game;
