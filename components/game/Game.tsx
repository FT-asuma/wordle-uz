"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./games.module.css";
import Keyboard from "./Keyboard";
import { motion } from "framer-motion";

interface IPrevList {
  prev: [
    {
      perLetter: string;
      isCorrect: boolean;
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
  const textareaRef = useRef<HTMLTextAreaElement | any>(null);
  const hiddenWord = "nigger";
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
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setCheck(!check);
      }
    });
  }, [textareaRef]);

  // useEffect(() => {
  //   if (length) {
  //     if (length.length === 6) {
  //       console.log("bnnin", length.length)
  //       if (check === true) {
  //         console.log(check);
  //         console.log("attempt to check");
  //         checkEachLetter(length);
  //       }
  //     } else {
  //       if (length.length < 6) {
  //         setCheck(false)
  //         if (check === true) {
  //           console.log("word is short");
  //         }
  //       }
  //     }
  //   } else {
  //     setLength("");
  //   }
  // }, [length]);


  useEffect(() => {}, [prevList]);

  const checkEachLetter = (word: string) => {
    // if (word.length === 6 && check === true) {
    //   console.log("attempt to check");
    // } else {
    //   alert("word is short");
    // }
    console.log(word)
    // console.log(hiddenWord)
  };

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
          setLength(e.currentTarget.value); 
          checkEachLetter(e.currentTarget.value)
        }}
        id=""
      ></textarea>
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
