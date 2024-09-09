"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./games.module.css";
import Keyboard from "./Keyboard";
import { motion } from "framer-motion";
import { ALPHABET, LIBRARY_2 } from "@/constants";
import Alert from "../popups/Alert";
import ReactConfetti from "react-confetti";

interface IPrevList {
  prev: [
    {
      perLetter: string;
      isCorrect: boolean;
      isOccured: boolean;
    }
  ];
}

const SHAPES = ["square", "triangle"];
const COLOR_DIGIT = "ABCDEF1234567890";

const Game = ({
  setWordLength,
  wordLength,
  listOfWords,
  lengthOfWord,
  hiddenWord,
}: {
  setWordLength: Dispatch<SetStateAction<number>>;
  wordLength: number;
  listOfWords: string[];
  lengthOfWord: string[];
  hiddenWord: string;
}) => {
  const [length, setLength] = useState<string>();
  const [prevList, setPrevList] = useState<IPrevList[]>([]);
  const [close, setClose] = useState(0);
  const [animate, setAnimate] = useState(0);
  const [check, setCheck] = useState(false);
  const [key, setKey] = useState<KeyboardEvent>();
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | any>(null);
  const [whichLib, setWhichLib] = useState<string[]>(listOfWords);
  console.log(hiddenWord);
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
      textareaRef.current.disabled = false;
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

  const [btn, setBtn] = useState(false);

  const checkEachLetter = (word: string) => {
    if (word?.length === wordLength) {
      const pend = whichLib.find(
        (c) => c.toLocaleLowerCase() === word.toLocaleLowerCase()
      );
      if (pend !== undefined) {
        if (pend === hiddenWord) {
          setBtn(true);
          setTimeout(() => {
            setBtn(false);
          }, 1500);
          checkWord(hiddenWord, pend);
          textareaRef.current.disabled = true;
        } else {
          if (pend) {
            checkWord(hiddenWord, pend);
          }
        }
      } else {
        setError("Word not found");
        setTimeout(() => {
          setError("");
        }, 700);
      }
    } else {
      if (word?.length < wordLength) {
        setError("Word is short");
        setTimeout(() => {
          setError("");
        }, 700);
      }
    }
  };

  const checkWord = (hiddenWord2: string, enteredWord: string) => {
    const entered = [];
    const previous: any = { prev: [] };
    const letterCount: any = {}; // Object to track occurrences of letters in the hidden word

    // Count occurrences of each letter in the hidden word
    hiddenWord2.split("").forEach((letter) => {
      letterCount[letter.toLowerCase()] =
        (letterCount[letter.toLowerCase()] || 0) + 1;
    });

    // Iterate through each letter in the entered word
    enteredWord.split("").forEach((letter, i) => {
      const lowerLetter = letter.toLowerCase();
      const isOccured = letterCount[lowerLetter] > 0; // Check if the letter occurred

      if (isOccured) {
        // Decrease the count for the letter to avoid counting it again
        letterCount[lowerLetter]--;
        entered.push(letter);
      } else {
        entered.push(null); // Push null if the letter did not occur
      }

      // Check if the letter is in the correct position
      const isCorrect = hiddenWord2[i].toLocaleLowerCase() === lowerLetter;

      // Store the results
      previous.prev.push({
        isCorrect: isCorrect,
        perLetter: letter,
        isOccured: isOccured,
      });
    });
    setPrevList((prev) => [...prev, previous]);
    setClose(close + 1);
    setAnimate(animate + 1);
    setLength("");
    console.log(previous);
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

  if (!listOfWords && !dimension) {
    return <>Loading...</>;
  }
  return (
    <section className={styles.game}>
      <textarea
        name=""
        ref={textareaRef}
        style={{ position: "fixed", zIndex: -1, opacity: 0 }}
        cols={0}
        rows={0}
        maxLength={lengthOfWord.length}
        value={length}
        onChange={(e) => {
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
        }}
        id=""
      ></textarea>
      <div
        style={
          btn === true
            ? { transition: "0.3s", opacity: 1, width: "100vw", zIndex: 100 }
            : { transition: "0.2s", opacity: 0, width: "100vw", zIndex: -100 }
        }
        className={styles.congrats}
      >
        <ReactConfetti
          width={1920}
          height={1000}
          tweenDuration={100}
          style={{
            width : "100vw",
            height: "100vh"
          }}
        />
      </div>
      <Alert value={error} type="alert" />
      <div className={styles.attempts}>
        <div className={styles.attempt}>
          {!prevList[0]
            ? lengthOfWord.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={styles.letterCont}
                  >
                    <motion.span className={styles.letter}>
                      {close === 0
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </div>
                );
              })
            : prevList[0]?.prev.map((i, a) => {
                console.log(i.isOccured);
                return (
                  <motion.div
                    // initial={animate === 1 ? { opacity: 0.75, scale: 0.8 } : {}}
                    // animate={animate === 1 ? { opacity: 1, scale: 1 } : {}}
                    // transition={animate === 1 ? { duration: 0.5 } : {}}
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={`${styles.letterCont} ${
                      i.isCorrect === true
                        ? styles.correctLetter
                        : i.isOccured === true
                        ? styles.occuredLetter
                        : styles.incorrectLetter
                    }`}
                  >
                    <span className={styles.letter}>
                      {i.perLetter.toLocaleUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
        </div>
        <div className={styles.attempt}>
          {!prevList[1]
            ? lengthOfWord.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={styles.letterCont}
                  >
                    <motion.span className={styles.letter}>
                      {close === 1
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </div>
                );
              })
            : prevList[1].prev.map((i, a) => {
                return (
                  <motion.div
                    // initial={prevList[1] ? { opacity: 0.75, scale: 0.8 } : {}}
                    // animate={prevList[1] ? { opacity: 1, scale: 1 } : {}}
                    // transition={prevList[1] ? { duration: 0.5 } : {}}
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={`${styles.letterCont} ${
                      i.isCorrect === true
                        ? styles.correctLetter
                        : i.isOccured === true
                        ? styles.occuredLetter
                        : styles.incorrectLetter
                    }`}
                  >
                    <span className={styles.letter}>
                      {i.perLetter.toLocaleUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
        </div>
        <div className={styles.attempt}>
          {!prevList[2]
            ? lengthOfWord.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={styles.letterCont}
                  >
                    <motion.span className={styles.letter}>
                      {close === 2
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </div>
                );
              })
            : prevList[2].prev.map((i, a) => {
                return (
                  <motion.div
                    // initial={prevList[1] ? { opacity: 0.75, scale: 0.8 } : {}}
                    // animate={prevList[1] ? { opacity: 1, scale: 1 } : {}}
                    // transition={prevList[1] ? { duration: 0.5 } : {}}
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={`${styles.letterCont} ${
                      i.isCorrect == true
                        ? styles.correctLetter
                        : i.isOccured === true
                        ? styles.occuredLetter
                        : styles.incorrectLetter
                    }`}
                  >
                    <span className={styles.letter}>
                      {i.perLetter.toLocaleUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
        </div>
        <div className={styles.attempt}>
          {!prevList[3]
            ? lengthOfWord.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={styles.letterCont}
                  >
                    <motion.span className={styles.letter}>
                      {close === 3
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </div>
                );
              })
            : prevList[3].prev.map((i, a) => {
                return (
                  <motion.div
                    // initial={prevList[1] ? { opacity: 0.75, scale: 0.8 } : {}}
                    // animate={prevList[1] ? { opacity: 1, scale: 1 } : {}}
                    // transition={prevList[1] ? { duration: 0.5 } : {}}
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={`${styles.letterCont} ${
                      i.isCorrect === true
                        ? styles.correctLetter
                        : i.isOccured === true
                        ? styles.occuredLetter
                        : styles.incorrectLetter
                    }`}
                  >
                    <span className={styles.letter}>
                      {i.perLetter.toLocaleUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
        </div>
        <div className={styles.attempt}>
          {!prevList[4]
            ? lengthOfWord.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={styles.letterCont}
                  >
                    <motion.span className={styles.letter}>
                      {close === 4
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </div>
                );
              })
            : prevList[4].prev.map((i, a) => {
                return (
                  <motion.div
                    // initial={prevList[1] ? { opacity: 0.75, scale: 0.8 } : {}}
                    // animate={prevList[1] ? { opacity: 1, scale: 1 } : {}}
                    // transition={prevList[1] ? { duration: 0.5 } : {}}
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={`${styles.letterCont} ${
                      i.isCorrect === true
                        ? styles.correctLetter
                        : i.isOccured === true
                        ? styles.occuredLetter
                        : styles.incorrectLetter
                    }`}
                  >
                    <span className={styles.letter}>
                      {i.perLetter.toLocaleUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
        </div>
        <div className={styles.attempt}>
          {!prevList[5]
            ? lengthOfWord.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={styles.letterCont}
                  >
                    <motion.span className={styles.letter}>
                      {close === 5
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </div>
                );
              })
            : prevList[5].prev.map((i, a) => {
                return (
                  <motion.div
                    // initial={prevList[1] ? { opacity: 0.75, scale: 0.8 } : {}}
                    // animate={prevList[1] ? { opacity: 1, scale: 1 } : {}}
                    // transition={prevList[1] ? { duration: 0.5 } : {}}
                    key={Math.random() ** 2}
                    style={
                      lengthOfWord.length < 10
                        ? { width: 56 }
                        : lengthOfWord.length === 10
                        ? { width: 54 }
                        : lengthOfWord.length === 11
                        ? { width: 48.5 }
                        : {}
                    }
                    className={`${styles.letterCont} ${
                      i.isCorrect === true
                        ? styles.correctLetter
                        : i.isOccured === true
                        ? styles.occuredLetter
                        : styles.incorrectLetter
                    }`}
                  >
                    <span className={styles.letter}>
                      {i.perLetter.toLocaleUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
        </div>
      </div>
      <Keyboard textareaRef={textareaRef} />
    </section>
  );
};

export default Game;
