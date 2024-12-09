"use client";

import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import styles from "./games.module.css";

// components
import Keyboard from "./Keyboard";
import { GameOver, Alert } from "../popups";
import { RenderAttemptRow } from "./util";

// context & interface & constant
import { useAppContext } from "@/context/AppContext";
import { IGameOverProps, IKeyboardProps, ILetterData } from "@/interface";
import { ALPHABET } from "@/constants";

interface IPrevList {
  prev: [ILetterData];
}

interface InitialStateProps {
  length: string;
  prevList: IPrevList[];
  close: number;
  error: string;
  checkedLetters: ILetterData[];
  modalOpen: boolean;
  text: string;
  gameWon: boolean;
}

type Action =
  | { type: "SET_LENGTH"; payload: string }
  | { type: "ADD_PREV_LIST"; payload: IPrevList } // Replace `any` with the correct type
  | { type: "INCREMENT_CLOSE" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_CHECKED_LETTERS"; payload: ILetterData[] } // Replace `any` with the correct type
  | { type: "TOGGLE_MODAL"; payload: boolean }
  | { type: "SET_TEXT"; payload: string }
  | { type: "SET_GAME_WON"; payload: boolean }
  | { type: "RESET_STATE" }; // For resetting the state entirely

const Game: React.FC = () => {
  const { wordLength, mode, listOfWords, hiddenWord } = useAppContext();

  const initialState: InitialStateProps = {
    length: "",
    prevList: [],
    close: 0,
    error: "",
    checkedLetters: [],
    modalOpen: false,
    text: "win",
    gameWon: false,
  };

  const [length, setLength] = useState<string>("");
  const [prevList, setPrevList] = useState<IPrevList[]>([]);
  const [close, setClose] = useState(0);
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
  const reducer = (
    state: InitialStateProps,
    action: Action
  ): InitialStateProps => {
    switch (action.type) {
      case "SET_LENGTH":
        return { ...state, length: action.payload };

      case "ADD_PREV_LIST":
        return { ...state, prevList: [...state.prevList, action.payload] };

      case "INCREMENT_CLOSE":
        return { ...state, close: state.close + 1 };

      case "SET_ERROR":
        return { ...state, error: action.payload };

      case "SET_CHECKED_LETTERS":
        return { ...state, checkedLetters: action.payload };

      case "TOGGLE_MODAL":
        return { ...state, modalOpen: action.payload };

      case "SET_TEXT":
        return { ...state, text: action.payload };

      case "SET_GAME_WON":
        return { ...state, gameWon: action.payload };

      case "RESET_STATE":
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

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
        dispatch({ type: "SET_TEXT", payload: "lost!" });
        dispatch({ type: "TOGGLE_MODAL", payload: true });
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
      dispatch({
        type: "SET_CHECKED_LETTERS",
        payload: getUniqueLetters(prevList),
      });
    }
  }, [prevList, modalOpen]);

  console.log(state);

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
  const checkWord = useCallback(
    (hiddenWord: string, enteredWord: string) => {
      const letterCount: Record<string, number> = {};
      // @ts-ignore
      const previous: IPrevList = { prev: [] };

      hiddenWord.split("").forEach((letter) => {
        const lowerLetter = letter.toLowerCase();
        letterCount[lowerLetter] = (letterCount[lowerLetter] || 0) + 1;
      });

      enteredWord.split("").forEach((letter, i) => {
        const lowerLetter = letter.toLowerCase();
        const isCorrect = hiddenWord[i].toLowerCase() === lowerLetter;

        previous.prev.push({
          isCorrect,
          perLetter: letter,
          countInWord: isCorrect
            ? --letterCount[lowerLetter]
            : letterCount[lowerLetter],
          isOccured: false,
        });
      });

      enteredWord.split("").forEach((letter, i) => {
        const lowerLetter = letter.toLowerCase();
        if (!previous.prev[i].isCorrect && letterCount[lowerLetter] > 0) {
          previous.prev[i].isOccured = true;
          letterCount[lowerLetter]--;
        }
      });

      setPrevList((prev) => [...prev, previous]);
      setClose(close + 1);
      setLength("");
    },
    [close]
  );

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
            attemptIndex,
            prevList,
            close,
            length,
          };
          return (
            <RenderAttemptRow key={`row-${attemptIndex}`} {...attemptProps} />
          );
        })}
      </div>
      {renderGameStatus({ prevList, text })}
      <Keyboard {...keyboardProps} />
    </section>
  );
};

// Sub component
const renderGameStatus = ({
  prevList,
  text,
}: {
  prevList: IPrevList[];
  text: string;
}) => {
  if (prevList?.length > 0) {
    switch (text) {
      case "won! 🏆":
        return <p className={styles.reward}>You Won! 🏆</p>;
      case "lost!":
        return <p className={styles.reward}>You lost!</p>;
      default:
        return <p style={{ height: 28 }} />;
    }
  }
  return <p style={{ height: 28 }}></p>;
};

export default Game;
