"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Key from "./keys/Key";
import { FOURTH_RAW, SECOND_RAW, THIRD_RAW } from "./list";
import styles from "./games.module.css";

interface KeyboardProps {
  textareaRef: any;
  length: string;
  setLength: Dispatch<SetStateAction<string>>;
  isEnterPressed: boolean;
  setIsEnterPressed: Dispatch<SetStateAction<boolean>>;
  text: string;
  wordLength: number;
  swap: boolean;
  mode: boolean;
  checkedLetters: {
    perLetter: string;
    isCorrect: boolean;
    isOccured: boolean;
  }[];
}

const Keyboard: React.FC<KeyboardProps> = ({
  textareaRef,
  length,
  setLength,
  isEnterPressed,
  setIsEnterPressed,
  text,
  wordLength,
  swap,
  mode,
  checkedLetters,
}) => {
  const [letter, setLetter] = useState<KeyboardEvent>();
  const [isClick, setIsClick] = useState<string>("");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => setLetter(e);
    const handleKeyRelease = () => setLetter(undefined);

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyRelease);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("keyup", handleKeyRelease);
    };
  }, [textareaRef]);

  const renderKeys = (keyList: { key: string }[]) =>
    keyList.map((item) => (
      <Key
        key={item.key}
        per_key={item.key}
        text={text}
        mode={mode}
        wordLength={wordLength}
        letter={letter as KeyboardEvent}
        setLength={setLength}
        length={length}
        setIsClick={setIsClick}
        isClick={isClick}
        checkedLetters={checkedLetters}
      />
    ));

  const handleExcludedKeyClick = (key: string) => {
    setIsClick(key);

    if (key === "Enter") {
      setIsEnterPressed(true);
      setTimeout(() => setIsEnterPressed(false), 100);
    } else if (key === "Backspace") {
      setLength(length.slice(0, -1));
    }
  };

  const excludedKeyStyle = (key: string) =>
    letter?.key === key || isClick === key
      ? { background: "#78838b", color: "#fff", transition: "0.3s" }
      : { transition: "0.3s" };

  return (
    <div tabIndex={-1} className={styles.keyboard}>
      <div className={styles.keyboardCont}>
        <div className={styles.rawList}>{renderKeys(SECOND_RAW)}</div>
        <div className={styles.rawList}>{renderKeys(THIRD_RAW)}</div>
        <div className={styles.rawList}>
          {swap === true ? (
            <button
              style={excludedKeyStyle("Enter")}
              onClick={() => handleExcludedKeyClick("Enter")}
              className={styles.excludedKey}
            >
              Enter
            </button>
          ) : (
            <button
              style={excludedKeyStyle("Backspace")}
              onClick={() => handleExcludedKeyClick("Backspace")}
              className={styles.excludedKey}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.23 9.78L15.01 12L17.23 14.22C17.52 14.51 17.52 14.99 17.23 15.28C17.08 15.43 16.89 15.5 16.7 15.5C16.51 15.5 16.32 15.43 16.17 15.28L13.95 13.06L11.73 15.28C11.58 15.43 11.39 15.5 11.2 15.5C11.01 15.5 10.82 15.43 10.67 15.28C10.38 14.99 10.38 14.51 10.67 14.22L12.89 12L10.67 9.78C10.38 9.49 10.38 9.01 10.67 8.72C10.96 8.43 11.44 8.43 11.73 8.72L13.95 10.94L16.17 8.72C16.46 8.43 16.94 8.43 17.23 8.72C17.52 9.01 17.52 9.49 17.23 9.78ZM21.32 7V17C21.32 17.96 20.54 18.75 19.57 18.75H7.64C7.02999 18.75 6.48 18.44 6.16 17.93L2.87 12.66C2.62 12.26 2.62 11.74 2.87 11.33L6.16 6.07C6.48 5.56 7.04 5.25 7.64 5.25H19.58C20.54 5.25 21.33 6.04 21.33 7H21.32ZM19.82 7C19.82 6.86 19.71 6.75 19.57 6.75H7.64C7.54999 6.75 7.47 6.79 7.43 6.87L4.22 12L7.43 17.13C7.48 17.2 7.56 17.25 7.64 17.25H19.58C19.72 17.25 19.83 17.14 19.83 17V7H19.82Z"
                  fill={mode === false ? "#e0e1dd" : "#4a5463"}
                ></path>
              </svg>
            </button>
          )}
          {renderKeys(FOURTH_RAW)}
          {swap === false ? (
            <button
              style={excludedKeyStyle("Enter")}
              onClick={() => handleExcludedKeyClick("Enter")}
              className={styles.excludedKey}
            >
              Enter
            </button>
          ) : (
            <button
              style={excludedKeyStyle("Backspace")}
              onClick={() => handleExcludedKeyClick("Backspace")}
              className={styles.excludedKey}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.23 9.78L15.01 12L17.23 14.22C17.52 14.51 17.52 14.99 17.23 15.28C17.08 15.43 16.89 15.5 16.7 15.5C16.51 15.5 16.32 15.43 16.17 15.28L13.95 13.06L11.73 15.28C11.58 15.43 11.39 15.5 11.2 15.5C11.01 15.5 10.82 15.43 10.67 15.28C10.38 14.99 10.38 14.51 10.67 14.22L12.89 12L10.67 9.78C10.38 9.49 10.38 9.01 10.67 8.72C10.96 8.43 11.44 8.43 11.73 8.72L13.95 10.94L16.17 8.72C16.46 8.43 16.94 8.43 17.23 8.72C17.52 9.01 17.52 9.49 17.23 9.78ZM21.32 7V17C21.32 17.96 20.54 18.75 19.57 18.75H7.64C7.02999 18.75 6.48 18.44 6.16 17.93L2.87 12.66C2.62 12.26 2.62 11.74 2.87 11.33L6.16 6.07C6.48 5.56 7.04 5.25 7.64 5.25H19.58C20.54 5.25 21.33 6.04 21.33 7H21.32ZM19.82 7C19.82 6.86 19.71 6.75 19.57 6.75H7.64C7.54999 6.75 7.47 6.79 7.43 6.87L4.22 12L7.43 17.13C7.48 17.2 7.56 17.25 7.64 17.25H19.58C19.72 17.25 19.83 17.14 19.83 17V7H19.82Z"
                  fill={mode === false ? "#e0e1dd" : "#4a5463"}
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
