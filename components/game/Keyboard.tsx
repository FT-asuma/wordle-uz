"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Key from "./keys/Key";
import { FOURTH_RAW, SECOND_RAW, THIRD_RAW } from "./list";
import styles from "./games.module.css";
import { useAppContext } from "@/context/AppContext";
import { IKeyboardProps } from "@/interface";
import renderExcludedKeyButton from "./util/renderExcludedKeyButton";



const Keyboard: React.FC<IKeyboardProps> = ({
  textareaRef,
  length,
  setLength,
  setIsEnterPressed,
  text,
  checkedLetters,
}) => {
  const [letter, setLetter] = useState<KeyboardEvent>();
  const [isClick, setIsClick] = useState<string>("");
  const { wordLength, swap, mode } = useAppContext();
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
  
  return (
    <div tabIndex={-1} className={styles.keyboard}>
      <div className={styles.keyboardCont}>
        <div className={styles.rawList}>{renderKeys(SECOND_RAW)}</div>
        <div className={styles.rawList}>{renderKeys(THIRD_RAW)}</div>
        <div className={styles.rawList}>
        {swap
        ? renderExcludedKeyButton("Enter", swap, handleExcludedKeyClick, mode)
        : renderExcludedKeyButton("Backspace", swap, handleExcludedKeyClick, mode)}
        {renderKeys(FOURTH_RAW)}
        {!swap
        ? renderExcludedKeyButton("Enter", swap, handleExcludedKeyClick, mode)
        : renderExcludedKeyButton("Backspace", swap, handleExcludedKeyClick, mode)}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
