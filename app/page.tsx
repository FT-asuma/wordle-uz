"use client";

// components
import { GameList, Header, GameContainer, Game } from "@/components";

// contexts
import { useAppContext } from "@/context/AppContext";

// interfaces
import { IHeaderProps } from "@/interface";

import styles from "./page.module.css";

export default function Home() {
  const { 
    hiddenWord,
    setList,
    setWordLength,
    wordLength,
    mode
  } = useAppContext();
  const headerProps: IHeaderProps = {
    hiddenWord,
    setList,
    setWordLength,
    wordLength
  }
  return (
    <main className={`${styles.main} ${mode ? styles.lightMode : ""}`}>
      <GameContainer>
        <Header {...headerProps}/>
        <Game/>
      </GameContainer>
      <GameList mode={mode} />
    </main>
  );
}
