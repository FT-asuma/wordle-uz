"use client";
import GameContainer from "@/components/container/GameContainer";
import styles from "./page.module.css";
import Header from "@/components/blocks/Header";
import Game from "@/components/game/Game";
import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

export default function Home() {

  const en_words = require("../constants/en_words/words.json")

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
    if (en_words) {
      const response = en_words.filter((word:string) => word.length === list.length);
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
      const response = en_words.filter((word:string) => word.length === wordLength);
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
          <p style={{ color: "white" }}>You are a {deviceType} user</p>
          <p style={{fontSize: 14}}>
            I am currently working on the <code>Puzzle-Game</code> project, a web-based game
            designed to provide an interactive and enjoyable puzzle-solving
            experience. In this project, I’m using <code>Next.js</code> to create a dynamic
            and responsive interface. The game features customizable settings
            such as adjustable word lengths, animated feedback, and options for
            <code><i>light</i></code> and <code><i>dark</i></code> modes. I’m focusing on creating an intuitive and
            engaging user experience, ensuring the game is both fun and easy to
            play <b><i>across devices</i></b>.
          </p>
        </GameContainer>
      </main>
    );
  }
}
