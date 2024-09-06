"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./games.module.css";
import Keyboard from "./Keyboard";
import { motion } from "framer-motion";
import { ALPHABET, LIBRARY } from "@/constants";
import Alert from "../popups/Alert";

interface IPrevList {
  prev: [
    {
      perLetter: string;
      isCorrect: boolean;
      isOccured: string;
    }
  ];
}

const emojis = ["🎉", "🎊", "🥳"];

const Game = () => {
  const [length, setLength] = useState<string>();
  const [list, setList] = useState<Array<string>>(["", "", "", "", "", ""]);
  const [prevList, setPrevList] = useState<IPrevList[]>([]);
  const [close, setClose] = useState(0);
  const [animate, setAnimate] = useState(0);
  const [win, setWin] = useState(false);
  const [check, setCheck] = useState(false);
  const [hiddenWord, setHiddenWord] = useState<string>();
  const [key, setKey] = useState<KeyboardEvent>();
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | any>(null);
  useEffect(() => {
    setHiddenWord(randomWord(LIBRARY, 1, LIBRARY.length));
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

  const randomWord = (list: string[], min: number, max: number) => {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return list[random];
  };
  const checkEachLetter = (word: string) => {
    console.log(hiddenWord);
    if (word?.length === 6) {
      const pend = LIBRARY.find(
        (c) => c.toLocaleLowerCase() === word.toLocaleLowerCase()
      );
      console.log(pend);
      if (pend !== undefined) {
        if (pend === hiddenWord) {
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
      if (word?.length < 6) {
        console.log("word is short");
      }
    }
  };
  console.log(prevList);
  return (
    <section className={styles.game}>
      <textarea
        name=""
        ref={textareaRef}
        style={{ position: "fixed", zIndex: -1, opacity: 0 }}
        cols={0}
        rows={0}
        maxLength={list.length}
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
      <Alert value={error} type="alert" />
      <div className={styles.attempts}>
        <div className={styles.attempt}>
          {close < 1
            ? list.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
            ? list.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
            ? list.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
            ? list.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
            ? list.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
            ? list.map((i, a) => {
                return (
                  <div
                    key={Math.random() ** 2}
                    style={
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
                      list.length < 10
                        ? { width: 56 }
                        : list.length === 10
                        ? { width: 54 }
                        : list.length === 11
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
      <Keyboard textareaRef={textareaRef} setList={setList} list={list} />
    </section>
  );
};

export default Game;
