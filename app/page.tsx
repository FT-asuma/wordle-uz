"use client"
import GameContainer from "@/components/container/GameContainer";
import styles from "./page.module.css";
import Header from "@/components/blocks/Header";
import Game from "@/components/game/Game";
import { useState } from "react";

export default function Home() {
  const [wordLength, setWordLength] = useState(4);
  return (
    <main className={styles.main}>
      <GameContainer>
        <Header setWordLength={setWordLength} wordLength={wordLength} />
        <Game setWordLength={setWordLength} wordLength={wordLength} />
      </GameContainer>
    </main>
  );
}
