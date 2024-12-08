"use client";
import Loading from "@/app/loading";
import { IGame } from "@/interface";
import React, { createContext, Suspense, useContext, useEffect, useState } from "react";

export const defaultValue: IGame = {
  wordLength: 4,
  setWordLength: () => {},
  loading: true,
  setLoading: () => {},
  listOfWords: [],
  setListOfWords: () => {},
  hiddenWord: "",
  setHiddenWord: () => {},
  lengthOfWord: Array(4).fill(""),
  setList: () => {},
  confetti: true,
  setConfetti: () => {},
  swap: false,
  setSwap: () => {},
  mode: false,
  setMode: () => {},
  deviceType: "Desktop",
  setDeviceType: () => {},
  randomWord: (list: string[], min: number, max: number) => list[0],
};


const AppContext = createContext<IGame>(defaultValue);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const en_words = require("../constants/en_words/words.json");

  const [wordLength, setWordLength] = useState(4);
  const [loading, setLoading] = useState(true);
  const [listOfWords, setListOfWords] = useState<string[]>([]);
  const [hiddenWord, setHiddenWord] = useState<string>("");

  // States for settings
  const [lengthOfWord, setList] = useState<string[]>(Array(wordLength).fill(""));
  const [confetti, setConfetti] = useState<boolean>(true);
  const [swap, setSwap] = useState<boolean>(false);
  const [mode, setMode] = useState<boolean>(false);

  const [deviceType, setDeviceType] = useState<string>("Desktop");

  const randomWord = (list: string[], min: number, max: number) => {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return list[random];
  };

  // Load settings from localStorage (only after component has mounted)
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setDeviceType(isMobile ? "Mobile" : "Desktop");
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (loading === false) {
      localStorage.setItem("confetti", JSON.stringify(confetti));
      localStorage.setItem("swap", JSON.stringify(swap));
      localStorage.setItem("mode", JSON.stringify(mode));
    }
    if (loading === true) {
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
  }, [confetti, swap, mode, loading]);

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
  if (loading || !hiddenWord) {
    return <Suspense fallback={<Loading />} />;
  }
  return (
    <AppContext.Provider value={{ confetti,deviceType,hiddenWord,lengthOfWord,listOfWords,loading,mode,randomWord,setConfetti,setDeviceType,setHiddenWord,setList,setListOfWords,setLoading,setMode,setSwap,setWordLength,swap,wordLength }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => {
  return useContext(AppContext);
};
