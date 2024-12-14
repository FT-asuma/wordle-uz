"use client";

// components
import { GameList, Header, GameContainer, Game } from "@/components";

// contexts
import { useAppContext } from "@/context/AppContext";

// interfaces
import { IHeaderProps } from "@/interface";

import styles from "./page.module.css";

export default function Home() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      // You can use reverse geocoding here to find the location
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  const { hiddenWord, setList, setWordLength, wordLength, mode } =
    useAppContext();

  const originalConsoleLog = console.log;
  console.log = (...args) => {
    originalConsoleLog("Custom log:", ...args);
  };

  const headerProps: IHeaderProps = {
    hiddenWord,
    setList,
    setWordLength,
    wordLength,
  };
  return (
    <main className={`${styles.main} ${mode ? styles.lightMode : ""}`}>
      <GameContainer>
        <Header {...headerProps} />
        <Game />
      </GameContainer>
      <GameList mode={mode} />
    </main>
  );
}
