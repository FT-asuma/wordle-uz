"use client";
import { Suspense } from "react";

import styles from "./page.module.css";

// components
import Loading from "@/app/loading";
import Header from "@/components/blocks/Header";
import Game from "../components/game/Game";
import GameList from "@/components/blocks/GameList";
import GameContainer from "@/components/container/GameContainer";
import { useDoubleTroubleContext } from "../context/AppContext";
import { IHeaderProps } from "@/interface";

export default function Home() {
  const {mode, hiddenWord, wordLength, setWordLength, setList} = useDoubleTroubleContext()
  const headerProps: IHeaderProps = {
    hiddenWord,
    setList,
    setWordLength,
    wordLength
  }
  return (
    <Suspense fallback={<Loading />}>
      <main className={`${styles.main} ${mode ? styles.lightMode : ""}`}>
        <GameContainer>
          <Header
            {...headerProps}
          />
          <Game />
        </GameContainer>
        <GameList mode={mode} />
      </main>
    </Suspense>
  );
}
