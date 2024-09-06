"use client";
import React, { useEffect, useState } from "react";
import styles from "../games.module.css";

interface KeyProperties {
  per_key: string;
  letter: KeyboardEvent;
  setIsClick: React.Dispatch<React.SetStateAction<string>>;
  isClick: string;
}

const Key = ({ per_key, letter, setIsClick, isClick }: KeyProperties) => {
  const key = per_key;
  return (
    <button
      key={key}
      onClick={() => {
        setIsClick(key);
      }}
      style={
        key === isClick
          ? { background: "#656a77", color: "#fff", transition: "0.3s" }
          : { transition: "0.3s" }
      }
      className={styles.key}
    >
      <span
        style={
          key === isClick
            ? {
                color: "#fff",
                transition: "1s",
                lineHeight: 1.1,
              }
            : { transition: "1s", lineHeight: 1.1 }
        }
        className="text-xl"
      >
        {per_key ? key : "~"}
      </span>
    </button>
  );
};

export default Key;
