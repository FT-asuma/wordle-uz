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
      isOccured: string;
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

  console.log(btn);
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
          const list = pend.split("");
          const previous: any = {
            prev: [],
          };
          list.map((letter, i) => {
            if (length && hiddenWord) {
              previous.prev.push({
                isCorrect: letter === hiddenWord[i],
                perLetter: letter,
                isOccured: hiddenWord
                  .split("")
                  .find((e) => e.toLocaleLowerCase() === letter),
              });
            }
          });
          setPrevList((prev) => [...prev, previous]);
          textareaRef.current.disabled = true;
          setClose(close + 1);
          setAnimate(animate + 1);
          setLength("");
        } else {
          if (pend) {
            const list = pend.split("");
            const previous: any = {
              prev: [],
            };
            list.map((letter, i) => {
              if (length && hiddenWord) {
                previous.prev.push({
                  isCorrect: letter === hiddenWord[i],
                  perLetter: letter,
                  isOccured: hiddenWord
                    .split("")
                    .find((e) => e.toLocaleLowerCase() === letter),
                });
              }
            });
            setPrevList((prev) => [...prev, previous]);
            setClose(close + 1);
            setAnimate(animate + 1);
            setLength("");
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
  const [windowDimension, setDimension] = useState({
    width: 1000,
    height: 1000,
  });
  const detectSize = () => {
    setDimension({
      width: document.body.offsetWidth,
      height: document.body.offsetHeight,
    });
  };
  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return window.removeEventListener("resize", detectSize);
  }, []);

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
          width={hiddenWord ? window.innerHeight : 1000}
          height={hiddenWord ? window.innerHeight : 10000}
          tweenDuration={100}
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
                        : i.isOccured === i.perLetter
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
                        : i.isOccured === i.perLetter
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
                      i.isCorrect === true
                        ? styles.correctLetter
                        : i.isOccured === i.perLetter
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
                        : i.isOccured === i.perLetter
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
                        : i.isOccured === i.perLetter
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
                        : i.isOccured === i.perLetter
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
