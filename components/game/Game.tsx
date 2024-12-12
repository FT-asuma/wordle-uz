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
import {
  Action,
  IKeyboardProps,
  ILetterData,
  InitialStateProps,
} from "@/interface";
import { ALPHABET } from "@/constants";
import renderGameStatus from "./util/renderGameStatus";
interface IPrevList {
  prev: [ILetterData];
}
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

  const textareaRef = useRef<HTMLTextAreaElement | any>(null);
  const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);
  const [length, setLength] = useState<string>("");
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
    setLength("");
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
      textareaRef.current.disabled = false;
      dispatch({ type: "RESET_STATE" });
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
    if (state.prevList.length === 6) {
      if (state.modalOpen === false) {
        dispatch({ type: "SET_TEXT", payload: "lost!" });
        dispatch({ type: "TOGGLE_MODAL", payload: true });
        setLength("")
      }
    }

    if (state.prevList.length > 0) {
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
      dispatch({
        type: "SET_CHECKED_LETTERS",
        payload: getUniqueLetters(state.prevList),
      });
    }
  }, [state.prevList, state.modalOpen]);

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
          dispatch({ type: "SET_TEXT", payload: "won! 🏆" });
          dispatch({ type: "SET_GAME_WON", payload: true });
          dispatch({ type: "TOGGLE_MODAL", payload: true });
          setLength("");
        } else {
          if (pend) {
            checkWord(hiddenWord as string, pend);
            setLength("");
          }
        }
      } else {
        if (state.modalOpen !== true) {
          dispatch({ type: "SET_ERROR", payload: "Word not found" });
          setTimeout(() => {
            dispatch({ type: "SET_ERROR", payload: "" });
          }, 700);
        }
      }
    } else {
      if (
        word?.length < wordLength &&
        state.modalOpen !== true &&
        state.prevList.length !== 6
      ) {
        dispatch({ type: "SET_ERROR", payload: "Word is short" });
        setTimeout(() => {
          dispatch({ type: "SET_ERROR", payload: "" });
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
      dispatch({ type: "ADD_PREV_LIST", payload: previous });
      dispatch({ type: "INCREMENT_CLOSE" });
      dispatch({ type: "SET_LENGTH", payload: "" });
    },
    [state.close]
  );

  const saveUserTextHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const listOfLetters = e.currentTarget.value.split("");
    const res: string[] = [];

    listOfLetters.forEach((l) => {
      const a = ALPHABET.find(
        (c) => c.toLocaleLowerCase() === l.toLocaleLowerCase()
      );
      if (a !== undefined) {
        res.push(a);
      }
    });

    setLength(res.join(""));
  };
  console.log(hiddenWord);
  // props~
  const gameOverProps = {
    state,
    dispatch,
  };

  const keyboardProps: IKeyboardProps = {
    setIsEnterPressed,
    textareaRef,
    state,
    dispatch,
    length,
    setLength,
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
      <Alert value={state.error} />
      <GameOver {...gameOverProps} />
      <div className={styles.attempts}>
        {Array.from({ length: 6 }).map((_, attemptIndex) => {
          const attemptProps = {
            attemptIndex,
            prevList: state.prevList,
            close: state.close,
            length: length,
          };
          return (
            <RenderAttemptRow key={`row-${attemptIndex}`} {...attemptProps} />
          );
        })}
      </div>
      {renderGameStatus(state)}
      <Keyboard {...keyboardProps} />
    </section>
  );
};
export default Game;
