"use client";
import GameContainer from "@/components/container/GameContainer";
import styles from "./page.module.css";
import Header from "@/components/blocks/Header";
import Game from "@/components/game/Game";
import { useEffect, useState } from "react";
import words from "an-array-of-english-words";

import { collection, getDocs } from "firebase/firestore";


export default function Home() {
  const [wordLength, setWordLength] = useState(4);
  const [loading, setLoading] = useState(true);
  const [listOfWords, setListOfWords] = useState<string[]>([]);
  const [hiddenWord, setHiddenWord] = useState<string>("");
  const [list, setList] = useState<Array<string>>(["", "", "", ""]);
  const [confetti, setConfetti] = useState<boolean>(true);
  const [swap, setSwap] = useState<boolean>(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [mode, setMode] = useState<boolean>(false);
  useEffect(() => {
    if (words) {
      const response = words.filter((word) => word.length === list.length);
      setHiddenWord(randomWord(response, 1, response.length));
      setListOfWords(response);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (mode === false) {
      const body = document.querySelector("body");
      if (body) {
        body.style.background = "";
      }
    } else {
      const body = document.querySelector("body");
      if (body) {
        body.style.transition = "0.2s";
        body.style.background = "#f8f7f5";
      }
    }
  }, [mode]);

  const [deviceType, setDeviceType] = useState("Desktop");

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setDeviceType(isMobile ? "Mobile" : "Desktop");
  }, []);

  const randomWord = (list: string[], min: number, max: number) => {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return list[random];
  };
  useEffect(() => {
    if (wordLength) {
      const response = words.filter((word) => word.length === wordLength);
      setHiddenWord(randomWord(response, 1, response.length));
      setListOfWords(response);
    }
  }, [wordLength]);

  if (loading === true && hiddenWord && document && document.body) {
    return <div>Loading...</div>;
  } else {
    return (
      <main
        className={
          mode === false ? styles.main : `${styles.main} ${styles.lightMode}`
        }
      >
        <GameContainer>
          <Header
            setConfetti={setConfetti}
            confetti={confetti}
            setSwap={setSwap}
            swap={swap}
            setList={setList}
            setWordLength={setWordLength}
            wordLength={wordLength}
            setMode={setMode}
            mode={mode}
          />
          <Game
            setWordLength={setWordLength}
            wordLength={wordLength}
            setConfetti={setConfetti}
            confetti={confetti}
            mode={mode}
            listOfWords={listOfWords}
            hiddenWord={hiddenWord!}
            lengthOfWord={list}
            setHiddenWord={setHiddenWord}
            swap={swap}
          />
          <p style={{ color: "white" }}>{deviceType}</p>
        </GameContainer>
      </main>
    );
  }
}
