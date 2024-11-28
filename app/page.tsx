"use client";
import { Suspense, useEffect, useState } from "react";
import GameContainer from "@/components/container/GameContainer";
import styles from "./page.module.css";
import Header from "@/components/blocks/Header";
import Game from "@/components/game/Game";
import Loading from "./loading";

export default function Home() {
  const en_words = require("../constants/en_words/words.json");

  const [wordLength, setWordLength] = useState(4);
  const [loading, setLoading] = useState(true);
  const [listOfWords, setListOfWords] = useState<string[]>([]);
  const [hiddenWord, setHiddenWord] = useState<string>("");

  // States for settings
  const [list, setList] = useState<string[]>(Array(wordLength).fill(""));
  const [confetti, setConfetti] = useState<boolean>(true);
  const [swap, setSwap] = useState<boolean>(false);
  const [mode, setMode] = useState<boolean>(false);

  const [deviceType, setDeviceType] = useState<string>("Desktop");

  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted

  const randomWord = (list: string[], min: number, max: number) => {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return list[random];
  };

  // Load settings from localStorage (only after component has mounted)
  useEffect(() => {
    setIsMounted(true); // Mark the component as mounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      const savedConfetti = localStorage.getItem("confetti");
      const savedSwap = localStorage.getItem("swap");
      const savedMode = localStorage.getItem("mode");

      if (savedConfetti !== null) {
        setConfetti(JSON.parse(savedConfetti));
      }
      if (savedSwap !== null) {
        setSwap(JSON.parse(savedSwap));
      }
      if (savedMode !== null) {
        setMode(JSON.parse(savedMode));
      }
    }
  }, [isMounted]);

  // Save settings to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("confetti", JSON.stringify(confetti));
      localStorage.setItem("swap", JSON.stringify(swap));
      localStorage.setItem("mode", JSON.stringify(mode));
    }
  }, [confetti, swap, mode, isMounted]);

  // Initialize word list and hidden word
  useEffect(() => {
    const response = en_words.filter(
      (word: string) => word.length === wordLength
    );
    setHiddenWord(randomWord(response, 1, response.length));
    setListOfWords(response);
    setLoading(false);
  }, [wordLength]);

  // Toggle light/dark mode
  useEffect(() => {
    const body = document.body;
    if (body) {
      body.style.transition = "0.2s";
      body.style.background = mode ? "#f8f7f5" : "";
    }
  }, [mode]);

  // Detect device type
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setDeviceType(isMobile ? "Mobile" : "Desktop");
  }, []);

  if (loading || !hiddenWord) {
    return <Suspense fallback={<Loading/>}/>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <main className={`${styles.main} ${mode ? styles.lightMode : ""}`}>
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
            hiddenWord={hiddenWord}
            lengthOfWord={list}
            setHiddenWord={setHiddenWord}
            swap={swap}
          />
          <p style={{ color: "white" }}>You are a {deviceType} user</p>
          <p style={{ fontSize: 14 }}>
            I am currently working on the <code>Puzzle-Game</code> project, a
            web-based game designed to provide an interactive and enjoyable
            puzzle-solving experience. In this project, I’m using{" "}
            <code>Next.js</code> to create a dynamic and responsive interface.
            The game features customizable settings such as adjustable word
            lengths, animated feedback, and options for{" "}
            <code>
              <i>light</i>
            </code>{" "}
            and{" "}
            <code>
              <i>dark</i>
            </code>{" "}
            modes. I’m focusing on creating an intuitive and engaging user
            experience, ensuring the game is both fun and easy to play{" "}
            <i>
              <b>across devices</b>
            </i>
            .
          </p>
        </GameContainer>
      </main>
    </Suspense>
  );
}
