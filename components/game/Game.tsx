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
import GameOver from "../popups/GameOver";

interface IPrevList {
  prev: [
    {
      perLetter: string;
      isCorrect: boolean;
      isOccured: boolean;
    }
  ];
}

const Game = ({
  setWordLength,
  wordLength,
  listOfWords,
  lengthOfWord,
  hiddenWord,
  setHiddenWord,
}: {
  setWordLength: Dispatch<SetStateAction<number>>;
  wordLength: number;
  listOfWords: string[];
  lengthOfWord: string[];
  hiddenWord: string;
  setHiddenWord: Dispatch<SetStateAction<string>>;
}) => {
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
  }, [prevList]);
  const [btn, setBtn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState<string>("win");

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
          setModalOpen(true);
          setText("won! 🏆");
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
      if (word?.length < wordLength && modalOpen !== true && prevList.length !== 6) {
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

    hiddenWord2.split("").forEach((letter) => {
      letterCount[letter.toLowerCase()] =
        (letterCount[letter.toLowerCase()] || 0) + 1;
    });

    enteredWord.split("").forEach((letter, i) => {
      const lowerLetter = letter.toLowerCase();
      const isOccured = letterCount[lowerLetter] > 0;
      if (isOccured) {
        letterCount[lowerLetter]--;
        entered.push(letter);
      } else {
        entered.push(null);
      }
      const isCorrect = hiddenWord2[i].toLocaleLowerCase() === lowerLetter;
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
        inputMode="none"
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
            width: "100vw",
            height: "100vh",
          }}
        />
      </div>
      <Alert value={error} type="alert" />
      <GameOver
        setText={setText}
        text={text}
        hiddenWord={hiddenWord}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        key={"asim is gay"}
        whichLib={whichLib}
        setHiddenWord={setHiddenWord}
        keyPress={key!}
      />
      <div className={styles.attempts}>
        <div className={styles.attempt}>
          {!prevList[0]
            ? lengthOfWord.map((i, a) => {
                return (
                  <motion.div
                    key={a} // Using index `a` as key
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
                    initial={{ scale: 1 }} // Normal size before typing
                    // animate={length[a] ? { scale: [1, 1.1, 1] } : {}} // Animate only the typed letter
                    transition={{
                      duration: 0.3, // Quick pop animation
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span className={styles.letter}>
                      {close === 0 ? length[a]?.toLocaleUpperCase() || "" : ""}
                    </motion.span>
                  </motion.div>
                );
              })
            : prevList[0]?.prev.map((i, a) => {
                return (
                  <motion.div
                    key={a} // Using index `a` as key
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
                    initial={{ rotateX: 180 }} // Initial state for the flip
                    animate={{ rotateX: 360 }} // Flip upside down (180 degrees along X-axis)
                    transition={{
                      duration: 0.6,
                      delay: a * 0.1, // Staggered flip for each letter
                      ease: "easeInOut", // Smooth transition
                      repeat: 0, // No repetition, animates once
                    }}
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
                  <motion.div
                    key={a} // Use index for stable keys
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
                    initial={{ scale: 1 }} // Initial scale
                    // animate={length[a] ? { scale: [1, 1.1, 1] } : {}} // Scale animation for typed letter
                    transition={{
                      duration: 0.3, // Speed of the animation
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span className={styles.letter}>
                      {close === 1
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </motion.div>
                );
              })
            : prevList[1].prev.map((i, a) => {
                return (
                  <motion.div
                    key={a} // Use index for stable keys
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
                    initial={{ rotateX: 180 }} // Initial rotation
                    animate={{ rotateX: 360 }} // Flip upside down
                    transition={{
                      duration: 0.6,
                      delay: a * 0.1, // Staggered flip effect
                      ease: "easeInOut",
                      repeat: 0, // Play once, no repeat
                    }}
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
                  <motion.div
                    key={a}
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
                    initial={{ scale: 1 }}
                    // animate={length[a] ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span className={styles.letter}>
                      {close === 2
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </motion.div>
                );
              })
            : prevList[2].prev.map((i, a) => {
                return (
                  <motion.div
                    key={a}
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
                    initial={{ rotateX: 180 }}
                    animate={{ rotateX: 360 }}
                    transition={{
                      duration: 0.6,
                      delay: a * 0.1,
                      ease: "easeInOut",
                      repeat: 0,
                    }}
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
                  <motion.div
                    key={a}
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
                    initial={{ scale: 1 }}
                    // animate={length[a] ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span className={styles.letter}>
                      {close === 3
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </motion.div>
                );
              })
            : prevList[3].prev.map((i, a) => {
                return (
                  <motion.div
                    key={a}
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
                    initial={{ rotateX: 180 }}
                    animate={{ rotateX: 360 }}
                    transition={{
                      duration: 0.6,
                      delay: a * 0.1,
                      ease: "easeInOut",
                      repeat: 0,
                    }}
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
                  <motion.div
                    key={a}
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
                    initial={{ scale: 1 }}
                    // animate={length[a] ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span className={styles.letter}>
                      {close === 4
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </motion.div>
                );
              })
            : prevList[4].prev.map((i, a) => {
                return (
                  <motion.div
                    key={a}
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
                    initial={{ rotateX: 180 }}
                    animate={{ rotateX: 360 }}
                    transition={{
                      duration: 0.6,
                      delay: a * 0.1,
                      ease: "easeInOut",
                      repeat: 0,
                    }}
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
                  <motion.div
                    key={a}
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
                    initial={{ scale: 1 }}
                    // animate={length[a] ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span className={styles.letter}>
                      {close === 5
                        ? length
                          ? length[a]?.toLocaleUpperCase()
                          : i
                        : ""}
                    </motion.span>
                  </motion.div>
                );
              })
            : prevList[5].prev.map((i, a) => {
                return (
                  <motion.div
                    key={a}
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
                    initial={{ rotateX: 180 }}
                    animate={{ rotateX: 360 }}
                    transition={{
                      duration: 0.6,
                      delay: a * 0.1,
                      ease: "easeInOut",
                      repeat: 0,
                    }}
                  >
                    <span className={styles.letter}>
                      {i.perLetter.toLocaleUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
        </div>
      </div>
      {text === "won! 🏆" && prevList?.length > 0 ?  <p className={styles.reward}>You Won! 🏆</p>: text === "lost" ? <p className={styles.reward}>You lost!</p> : <p style={{height: 28}}></p>}
      <Keyboard
        length={length}
        setIsEnterPressed={setIsEnterPressed}
        isEnterPressed={isEnterPressed}
        setLength={setLength}
        text={text}
        textareaRef={textareaRef}
      />
    </section>
  );
};

export default Game;
