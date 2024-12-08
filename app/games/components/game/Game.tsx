"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import styles from "./game.module.css";
import Keyboard from "@/components/game/Keyboard";
import { ALPHABET } from "@/constants";
import Alert from "@/components/popups/Alert";
import GameOver from "@/components/popups/GameOver";
import RenderAttemptRow from "../util/RenderAttemptRow";

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
  wordLength,
  mode,
  listOfWords,
  lengthOfWord,
  hiddenWord,
  setHiddenWord,
  swap,
}: {
  wordLength: number;
  listOfWords: string[];
  lengthOfWord: string[];
  hiddenWord: string[];
  mode: boolean;
  setHiddenWord: Dispatch<SetStateAction<string[]>>;
  swap: boolean;
}) => {
  const [length, setLength] = useState<string>("");
  const [length1, setLength1] = useState<string>("");
  const [prevList, setPrevList] = useState<IPrevList[]>([]);
  const [prevList2, setPrevList2] = useState<IPrevList[]>([]);
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
  const [isGameDisabled, setGameDisabled] = useState(false);
  const [isGameDisabled2, setGameDisabled2] = useState(false);
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
      setPrevList2([]);
      setClose(0);
      setGameDisabled(false);
      setGameDisabled2(false);
      setCheckedLetters([]);
    }
  }, [hiddenWord]);
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      setKey(e);
    });
  }, [textareaRef]);
  useEffect(() => {
    if (length?.length || length1.length) {
      setCheck(false);
    }
  }, [length, length1]);

  useEffect(() => {
    if (key) {
      if (key.key === "Enter") {
        setCheck(!check);
        if (isGameDisabled === false) {
          checkEachLetter(length1!);
        } else {
          checkEachLetter(length!);
        }
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
    if (prevList.length === 7 || prevList2.length === 7) {
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
    if (prevList2 && prevList2.length > 0) {
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
  }, [prevList, prevList2]);

  useEffect(() => {
    if (isGameDisabled === true && isGameDisabled2 === true) {
      setModalOpen(true);
      setText("won! 🏆");
      setGameWon(true);
    }
  }, [isGameDisabled, isGameDisabled2]);

  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState<string>("win");
  const [gameWon, setGameWon] = useState(false);

  const hiddenWord1 = hiddenWord[0];
  const hiddenWord2 = hiddenWord[1];

  const checkEachLetter = (word: string) => {
    if (word.length === hiddenWord1.length) {
      const pend = whichLib.find(
        (c) => c.toLocaleLowerCase() === word.toLocaleLowerCase()
      );
      if (pend !== undefined) {
        if (word.toLocaleLowerCase() === hiddenWord1.toLocaleLowerCase()) {
          checkWord(hiddenWord1, word);
          setGameDisabled(true);
        } else {
          checkWord(hiddenWord1, word);
        }
        if (word.toLocaleLowerCase() === hiddenWord2.toLocaleLowerCase()) {
          checkWord2(hiddenWord2, word);
          setGameDisabled2(true);
        } else {
          checkWord2(hiddenWord2, word);
        }
      } else {
        setError("The word is not found");
        setTimeout(() => {
          setError("");
        }, 1000);
      }
    } else {
      setError("Your word is short");
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  const checkWord = (hiddenWord2: string, enteredWord: string) => {
    if (isGameDisabled === true) return;
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
    setLength1("");
  };

  const checkWord2 = (hiddenWord2: string, enteredWord: string) => {
    if (isGameDisabled2 === true) return;
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
    setPrevList2((prev) => [...prev, previous]);
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
    <section className={mode === false ? styles.game : styles.lightMode}>
      {isGameDisabled !== true || isGameDisabled2 !== true ? (
        <textarea
          name=""
          inputMode="none"
          ref={textareaRef}
          style={{ position: "fixed", zIndex: -1, opacity: 0 }}
          cols={0}
          rows={0}
          maxLength={lengthOfWord.length}
          value={isGameDisabled2 === true ? length1 : length}
          onChange={(e) => {
            const listOfLetters = e.currentTarget.value.split("");
            const res: string[] = [];
            listOfLetters.forEach((l) => {
              const a = ALPHABET.find(
                (c) => c.toLocaleLowerCase() === l.toLocaleLowerCase()
              );
              if (a !== undefined) res.push(a);
            });

            // Update only the enabled field
            if (!isGameDisabled && !isGameDisabled2) {
              setLength(res.join("").trim());
              setLength1(res.join("").trim());
            } else if (!isGameDisabled) {
              setLength1(res.join("").trim());
            } else if (!isGameDisabled2) {
              setLength(res.join("").trim());
            }
          }}
          id=""
        ></textarea>
      ) : null}
      <Alert value={error} />
      {/* <GameOver
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
      /> */}
      <div className={styles.content}>
        <div className={styles.attempts}>
          {Array.from({ length: 7 }).map((_, attemptIndex) => (
            <RenderAttemptRow
              key={`row-${attemptIndex}`}
              attemptIndex={attemptIndex}
              prevList={prevList}
              lengthOfWord={lengthOfWord}
              close={close}
              length={length1}
              mode={mode}
              hiddenWord={hiddenWord1}
            />
          ))}
        </div>
        <div className={styles.attempts}>
          {Array.from({ length: 7 }).map((_, attemptIndex) => (
            <RenderAttemptRow
              key={`row-${attemptIndex}`}
              attemptIndex={attemptIndex}
              prevList={prevList2}
              lengthOfWord={lengthOfWord}
              close={close}
              length={length}
              mode={mode}
              hiddenWord={hiddenWord1}
            />
          ))}
        </div>
      </div>
      {text === "won! 🏆" && prevList?.length > 0 ? (
        <p className={styles.reward}>You Won! 🏆</p>
      ) : text === "lost!" && prevList?.length > 0 ? (
        <p className={styles.reward}>You lost!</p>
      ) : (
        <p style={{ height: 28 }}></p>
      )}
      {/* <Keyboard
        setIsEnterPressed={setIsEnterPressed}
        textareaRef={textareaRef}
      /> */}
    </section>
  );
};

export default Game;
