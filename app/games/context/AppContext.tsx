"use client";
import Loading from "@/app/loading";
import { IDoubleTrouble } from "@/interface";
import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

const defaultValue: IDoubleTrouble = {
  wordLength: 4,
  setWordLength: () => {},
  loading: true,
  setLoading: () => {},
  listOfWords: [],
  setListOfWords: () => {},
  hiddenWord: [],
  setHiddenWord: () => {},
  confetti: true,
  setConfetti: () => {},
  swap: false,
  setSwap: () => {},
  mode: false,
  setMode: () => {},
  deviceType: "Desktop",
  setDeviceType: () => {},
  randomWords: (list: string[], min: number, max: number) => list,
};

const DoubleTroubleContext = createContext<IDoubleTrouble>(defaultValue);

const DoubleTroubleProvider = ({ children }: { children: React.ReactNode }) => {
  const en_words = require("@/constants/en_words/words.json");
  const [wordLength, setWordLength] = useState(4);
  const [loading, setLoading] = useState(true);
  const [listOfWords, setListOfWords] = useState<string[]>([]);
  const [hiddenWord, setHiddenWord] = useState<string[]>([]);

  // States for settings
  const [confetti, setConfetti] = useState<boolean>(true);
  const [swap, setSwap] = useState<boolean>(false);
  const [mode, setMode] = useState<boolean>(false);

  const [deviceType, setDeviceType] = useState<string>("Desktop");

  const randomWords = (list: string[], min: number, max: number) => {
    const randomIndex1 = Math.floor(Math.random() * (max - min)) + min;
    let randomIndex2 = Math.floor(Math.random() * (max - min)) + min;

    while (randomIndex2 === randomIndex1) {
      randomIndex2 = Math.floor(Math.random() * (max - min)) + min;
    }

    return [list[randomIndex1], list[randomIndex2]];
  };

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setDeviceType(isMobile ? "Mobile" : "Desktop");
  }, [deviceType]);

  useEffect(() => {
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
  }, [loading]);

  // Save settings to localStorage
  useEffect(() => {
    if (loading) {
      localStorage.setItem("confetti", JSON.stringify(confetti));
      localStorage.setItem("swap", JSON.stringify(swap));
      localStorage.setItem("mode", JSON.stringify(mode));
    }
  }, [confetti, swap, mode, loading]);

  // Initialize word list and hidden word
  useEffect(() => {
    const response = en_words.filter(
      (word: string) => word.length === wordLength
    );

    setHiddenWord(randomWords(response, 0, response.length));
    setListOfWords(response);
    setLoading(false);
  }, [wordLength]);

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
    <DoubleTroubleContext.Provider
      value={{
        confetti,
        deviceType,
        hiddenWord,
        listOfWords,
        loading,
        mode,
        randomWords,
        setConfetti,
        setDeviceType,
        setHiddenWord,
        setListOfWords,
        setLoading,
        setMode,
        setSwap,
        setWordLength,
        swap,
        wordLength,
      }}
    >
      {children}
    </DoubleTroubleContext.Provider>
  );
};

export default DoubleTroubleProvider;

export const useDoubleTroubleContext = () => {
  return useContext(DoubleTroubleContext);
};
