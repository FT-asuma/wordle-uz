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
import LetterComponent from "../utils/LetterProps";
import { v4 as uuidv4 } from "uuid";
interface IPrevList {
  prev: [
    {
      perLetter: string;
      isCorrect: boolean;
      isOccured: boolean;
      countInWord: number;
    }
  ];
}

const Game = ({
  setWordLength,
  wordLength,
  mode,
  setConfetti,
  confetti,
  listOfWords,
  lengthOfWord,
  hiddenWord,
  setHiddenWord,
  swap,
}: {
  setWordLength: Dispatch<SetStateAction<number>>;
  wordLength: number;
  listOfWords: string[];
  lengthOfWord: string[];
  hiddenWord: string;
  mode: boolean;
  setHiddenWord: Dispatch<SetStateAction<string>>;
  setConfetti: Dispatch<SetStateAction<boolean>>;
  confetti: boolean;
  swap: boolean;
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
  const [checkedLetters, setCheckedLetters] = useState<
    {
      perLetter: string;
      isCorrect: boolean;
      isOccured: boolean;
    }[]
  >([]);
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

  const [btn, setBtn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState<string>("win");
  const [gameWon, setGameWon] = useState(false)
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
          setGameWon(true)
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
  console.log(hiddenWord);

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
      ></div>
      <Alert value={error} type="alert" />
      <GameOver
        setText={setText}
        text={text}
        hiddenWord={hiddenWord}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        key={"sheesh"}
        gameWon={gameWon}
        setGameWon={setGameWon}
        whichLib={whichLib}
        lengthOfWord={lengthOfWord}
        setHiddenWord={setHiddenWord}
      />
      <div className={styles.attempts}>
        <div
          className={
            mode === false && prevList[0]
              ? styles.attempt
              : mode === true || prevList[0]
              ? `${styles.attempt} ${styles.attemptLight}`
              : styles.attempt
          }
        >
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
                    transition={{
                      duration: 0.3, // Quick pop animation
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span
                      style={mode === true ? { color: "#2e3239" } : {}}
                      className={styles.letter}
                    >
                      {close === 0 ? length[a]?.toLocaleUpperCase() || "" : ""}
                    </motion.span>
                  </motion.div>
                );
              })
            : prevList[0]?.prev.map((i, a) => {
                return (
                  <LetterComponent
                    key={i.perLetter + a} // Make key unique by combining letter and index
                    a={a}
                    i={i}
                    lengthOfWord={lengthOfWord}
                  />
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
                    transition={{
                      duration: 0.3, // Speed of the animation
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span
                      style={mode === true ? { color: "#2e3239" } : {}}
                      className={styles.letter}
                    >
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
                  <LetterComponent
                    a={a}
                    i={i}
                    lengthOfWord={lengthOfWord}
                    key={i.perLetter + a} // Make key unique by combining letter and index
                  />
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
                    <motion.span
                      style={mode === true ? { color: "#2e3239 " } : {}}
                      className={styles.letter}
                    >
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
                  <LetterComponent
                    key={i.perLetter + a} // Make key unique by combining letter and index
                    a={a}
                    i={i}
                    lengthOfWord={lengthOfWord}
                  />
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
                    <motion.span
                      style={mode === true ? { color: "#2e3239 " } : {}}
                      className={styles.letter}
                    >
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
                  <LetterComponent
                    key={i.perLetter + a} // Make key unique by combining letter and index
                    a={a}
                    i={i}
                    lengthOfWord={lengthOfWord}
                  />
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
                    <motion.span
                      style={mode === true ? { color: "#2e3239 " } : {}}
                      className={styles.letter}
                    >
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
                  <LetterComponent
                    key={i.perLetter + a} // Make key unique by combining letter and index
                    a={a}
                    i={i}
                    lengthOfWord={lengthOfWord}
                  />
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
                    <motion.span
                      style={mode === true ? { color: "#2e3239 " } : {}}
                      className={styles.letter}
                    >
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
                  <LetterComponent
                    key={i.perLetter + a} // Make key unique by combining letter and index
                    a={a}
                    i={i}
                    lengthOfWord={lengthOfWord}
                  />
                );
              })}
        </div>
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
