"use client";
import { Suspense, useEffect, useState } from "react";

import styles from "./page.module.css";


// components
import Loading from "@/app/loading";
import Header from "@/components/blocks/Header";
import Game from "../components/game/Game";
import GameList from "@/components/blocks/GameList";
import GameContainer from "@/components/container/GameContainer";

// provider
import { useAppContext } from "../context/AppContext";

export default function Home() {
  const en_words = require("@/constants/en_words/words.json");
  const {value, setValue} = useAppContext()
  console.log(value)
  const [wordLength, setWordLength] = useState(4);
  const [loading, setLoading] = useState(true);
  const [listOfWords, setListOfWords] = useState<string[]>([]);
  const [hiddenWord, setHiddenWord] = useState<string[]>([]);

  // States for settings
  const [list, setList] = useState<string[]>(Array(wordLength).fill(""));
  const [confetti, setConfetti] = useState<boolean>(true);
  const [swap, setSwap] = useState<boolean>(false);
  const [mode, setMode] = useState<boolean>(false);

  const [deviceType, setDeviceType] = useState<string>("Desktop");

  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted

  const randomWords = (list: string[], min: number, max: number) => {
    const randomIndex1 = Math.floor(Math.random() * (max - min)) + min;
    let randomIndex2 = Math.floor(Math.random() * (max - min)) + min;

    // Ensure the second word is not the same as the first
    while (randomIndex2 === randomIndex1) {
      randomIndex2 = Math.floor(Math.random() * (max - min)) + min;
    }

    return [list[randomIndex1], list[randomIndex2]]; // Return two different words
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

    // Adjust difficulty by changing word list size or other properties
    setHiddenWord(randomWords(response, 0, response.length)); // Hard difficulty: long list of words
    setListOfWords(response);
    setLoading(false);
  }, [wordLength]); // Re-run when difficulty changes
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
    return <Suspense fallback={<Loading />} />;
  }
  return (
    <Suspense fallback={<Loading />}>
      <main className={`${styles.main} ${mode ? styles.lightMode : ""}`}>
        <GameContainer>
          <Header
            hiddenWord={hiddenWord}
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
            wordLength={wordLength}
            mode={mode}
            listOfWords={listOfWords}
            hiddenWord={hiddenWord}
            lengthOfWord={list}
            setHiddenWord={setHiddenWord}
            swap={swap}
          />
        </GameContainer>
        <GameList mode={mode} />
      </main>
    </Suspense>
  );
}
