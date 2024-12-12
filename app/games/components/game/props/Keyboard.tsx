"use client";

import { useEffect, useState } from "react";

import styles from "../game.module.css";

import Key from "./keys/Key";
import { renderExcludedKeyButton } from "./util";

import { useAppContext } from "@/context/AppContext";
import { IKeyboardProps, IKeyboardProps1, IKeyProps } from "@/interface";
import { FOURTH_RAW, SECOND_RAW, THIRD_RAW } from "@/components/game/list";

const Keyboard: React.FC<IKeyboardProps1> = ({
  textareaRef,
  setIsEnterPressed,
  dispatch,
  state,
  length,
  setLength,
  length1,
  setLength1,
}) => {
  const [letter, setLetter] = useState<KeyboardEvent>();
  const [isClick, setIsClick] = useState<string>("");
  const { swap, mode } = useAppContext();
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
    keyList.map((item) => {
      const keyProperties: IKeyProps = {
        per_key: item.key,
        setIsClick,
        dispatch,
        state,
        setLength,
      };
      return <Key key={item.key} {...keyProperties} />;
    });

  const handleExcludedKeyClick = (key: string) => {
    setIsClick(key);

    if (key === "Enter") {
      setIsEnterPressed(true);
      setTimeout(() => setIsEnterPressed(false), 100);
    }
    if (key === "Backspace") {
      if (length) {
        setLength(length.slice(0, -1));
      } else {
        setLength1(length1.slice(0, 1));
      }
    }
  };

  return (
    <div tabIndex={-1} className={styles.keyboard}>
      <div className={styles.keyboardCont}>
        <div className={styles.rawList}>{renderKeys(SECOND_RAW)}</div>
        <div className={styles.rawList}>{renderKeys(THIRD_RAW)}</div>
        <div className={styles.rawList}>
          {swap
            ? renderExcludedKeyButton("Enter", handleExcludedKeyClick, mode)
            : renderExcludedKeyButton(
                "Backspace",
                handleExcludedKeyClick,
                mode
              )}
          {renderKeys(FOURTH_RAW)}
          {!swap
            ? renderExcludedKeyButton("Enter", handleExcludedKeyClick, mode)
            : renderExcludedKeyButton(
                "Backspace",
                handleExcludedKeyClick,
                mode
              )}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
