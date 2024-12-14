"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  useReducer,
  useCallback,
} from "react";
import styles from "./game.module.css";
import Keyboard from "./props/Keyboard";
import { ALPHABET } from "@/constants";
import Alert from "@/components/popups/Alert";
import GameOver from "@/components/popups/GameOver";
import RenderAttemptRow from "../util/RenderAttemptRow";
import { useDoubleTroubleContext } from "../../context/AppContext";
import {
  Action,
  IKeyboardProps,
  IKeyboardProps1,
  InitialStateProps,
} from "@/interface";
import renderGameStatus from "./props/util/renderGameStatus";

interface IPrevList {
  prev: {
    perLetter: string;
    isCorrect: boolean;
    isOccured: boolean;
    countInWord: number;
  }[];
}

const Game = () => {
  const { wordLength, hiddenWord, listOfWords, mode } =
    useDoubleTroubleContext();

  // State management
  const [length, setLength] = useState<string>("");
  const [length1, setLength1] = useState<string>("");
  const [key, setKey] = useState<KeyboardEvent | undefined>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [whichLib, setWhichLib] = useState<string[]>(listOfWords);
  const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);
  const [isGameDisabled, setGameDisabled] = useState(false);
  const [isGameDisabled2, setGameDisabled2] = useState(false);

  const initialState: InitialStateProps = {
    length: "",
    prevList: [],
    prevList1: [],
    close: 0,
    error: "",
    checkedLetters: [],
    modalOpen: false,
    text: "win",
    gameWon: false,
  };

  // Reducer for game state management
  const reducer = (
    state: InitialStateProps,
    action: Action
  ): InitialStateProps => {
    switch (action.type) {
      case "SET_LENGTH":
        return { ...state, length: action.payload };
      case "ADD_PREV_LIST":
      case "ADD_SECOND_PREV_LIST":
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
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Focus the textarea when the user clicks or presses keys
  useEffect(() => {
    const focusTextarea = () => {
      if (textareaRef.current) textareaRef.current.focus();
    };
    document.addEventListener("click", focusTextarea);
    document.addEventListener("keydown", focusTextarea);
    return () => {
      document.removeEventListener("click", focusTextarea);
      document.removeEventListener("keydown", focusTextarea);
    };
  }, []);

  // Reset game when the hidden word changes
  useEffect(() => {
    if (hiddenWord) {
      setWhichLib(listOfWords);
      dispatch({ type: "RESET_STATE" });
      setGameDisabled(false);
      setGameDisabled2(false);
    }
  }, [hiddenWord]);

  // Handle key press for Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setKey(e);
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (key && key.key === "Enter") {
      if (!isGameDisabled) {
        checkEachLetter(length1);
      } else {
        checkEachLetter(length);
      }
    }
  }, [key, length, length1, isGameDisabled]);

  // Handle checking of letters for each word
  useEffect(() => {
    const getUniqueLetters = (attempts: any) => {
      const seen = new Set<string>(); // Define type for clarity
      const uniqueLetters: any[] = []; // Store unique letter objects

      if (!Array.isArray(attempts)) {
        console.error("Invalid input: attempts must be an array.");
        return uniqueLetters;
      }

      attempts.forEach((attempt: any) => {
        if (Array.isArray(attempt.prev)) {
          // Ensure `prev` is an array
          attempt.prev.forEach((letterObj: any) => {
            if (letterObj?.perLetter && !seen.has(letterObj.perLetter)) {
              seen.add(letterObj.perLetter); // Add unique letter to the set
              uniqueLetters.push(letterObj); // Push the letter object
            }
          });
        } else {
          console.warn(
            "Skipping attempt with invalid 'prev' property:",
            attempt
          );
        }
      });

      return uniqueLetters;
    };
    if (state.prevList1.length > 0) {
      dispatch({
        type: "SET_CHECKED_LETTERS",
        payload: getUniqueLetters(state.prevList1),
      });
    }
  }, [state.prevList]);

  // Handle game over and game win conditions
  useEffect(() => {
    if (isGameDisabled && isGameDisabled2) {
      dispatch({ type: "TOGGLE_MODAL", payload: true });
      dispatch({ type: "SET_TEXT", payload: "won! 🏆" });
      dispatch({ type: "SET_GAME_WON", payload: true });
    }
  }, [isGameDisabled, isGameDisabled2]);

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
        dispatch({ type: "SET_ERROR", payload: "The word is not found" });
        setTimeout(() => {
          dispatch({ type: "SET_ERROR", payload: "" });
        }, 1000);
      }
    } else {
      dispatch({ type: "SET_ERROR", payload: "Your word is short" });
      setTimeout(() => {
        dispatch({ type: "SET_ERROR", payload: "" });
      }, 1000);
    }
  };

  const checkWord = useCallback(
    (hiddenWord: string, enteredWord: string) => {
      if (isGameDisabled2 === true) return;
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

  const checkWord2 = (hiddenWord2: string, enteredWord: string) => {
    if (isGameDisabled2) return;

    const previous: IPrevList = { prev: [] }; // Initialize with the correct type
    const letterCount: Record<string, number> = {};

    // Count letters in the hidden word
    hiddenWord2.split("").forEach((letter) => {
      const lowerLetter = letter.toLowerCase();
      letterCount[lowerLetter] = (letterCount[lowerLetter] || 0) + 1;
    });

    // First pass - check for exact matches
    enteredWord.split("").forEach((letter, i) => {
      const lowerLetter = letter.toLowerCase();
      const isCorrect = hiddenWord2[i].toLowerCase() === lowerLetter;

      previous.prev.push({
        perLetter: letter,
        isCorrect,
        isOccured: false,
        countInWord: isCorrect
          ? --letterCount[lowerLetter]
          : letterCount[lowerLetter] || 0, // Handle undefined gracefully
      });
    });

    // Second pass - check for non-exact matches
    enteredWord.split("").forEach((letter, i) => {
      const lowerLetter = letter.toLowerCase();
      if (!previous.prev[i].isCorrect && letterCount[lowerLetter] > 0) {
        previous.prev[i].isOccured = true;
        letterCount[lowerLetter]--;
      }
    });

    dispatch({
      type: "ADD_SECOND_PREV_LIST",
      payload: (prev: IPrevList[]) => [...prev, previous],
    });
    dispatch({ type: "INCREMENT_CLOSE" });
    dispatch({ type: "SET_LENGTH", payload: "" });
  };

  // Handle input change for word guessing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputLetters = e.currentTarget.value.split("");
    const validLetters = inputLetters
      .map((letter) =>
        ALPHABET.find((char) => char.toLowerCase() === letter.toLowerCase())
      )
      .filter((char): char is string => char !== undefined);

    const result = validLetters.join("").trim();
    if (!isGameDisabled && !isGameDisabled2) {
      setLength(result);
      setLength1(result);
    } else if (!isGameDisabled) {
      setLength1(result);
    } else if (!isGameDisabled2) {
      setLength(result);
    }
  };

  console.log(state.prevList1);

  // Handle window dimension changes
  const [dimension, setDimension] = useState<{
    width: number;
    height: number;
  }>();
  useEffect(() => {
    if (dimension) {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  // props~

  console.log(hiddenWord);

  const keyboardProps: IKeyboardProps1 = {
    dispatch,
    length,
    length1,
    setIsEnterPressed,
    setLength,
    setLength1,
    state,
    textareaRef,
  };

  const gameOverProps = {
    state,
    dispatch,
  };

  useEffect(() => {
    console.log("dfghjkl");
  }, []);

  return (
    <section className={mode === false ? styles.game : styles.lightMode}>
      {isGameDisabled !== true || isGameDisabled2 !== true ? (
        <textarea
          ref={textareaRef}
          style={{ position: "fixed", zIndex: -1, opacity: 0 }}
          maxLength={wordLength}
          value={isGameDisabled2 === true ? length1 : length}
          onChange={handleInputChange}
        ></textarea>
      ) : null}
      <Alert value={state.error} />
      <GameOver {...gameOverProps} />
      <div className={styles.content}>
        <div className={styles.attempts}>
          {Array.from({ length: 7 }).map((_, attemptIndex) => {
            const attemptProps = {
              attemptIndex,
              prevList: state.prevList,
              close: state.close,
              length: length,
              hiddenWord: hiddenWord[0],
            };
            return (
              <RenderAttemptRow key={`row-${attemptIndex}`} {...attemptProps} />
            );
          })}
        </div>
        <div className={styles.attempts}>
          {Array.from({ length: 7 }).map((_, attemptIndex) => {
            const attemptProps = {
              attemptIndex,
              prevList: state.prevList,
              close: state.close,
              length: length1,
              hiddenWord: hiddenWord[1],
            };
            return (
              <RenderAttemptRow key={`row-${attemptIndex}`} {...attemptProps} />
            );
          })}
        </div>
      </div>
      {renderGameStatus(state)}
      <Keyboard {...keyboardProps} />
    </section>
  );
};

export default Game;
