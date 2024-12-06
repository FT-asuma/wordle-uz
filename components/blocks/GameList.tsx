"use client";
import React from "react";
import styles from "./gamelist.module.css";
import Wrapper from "../container/Wrapper";
import GameCard from "../utils/gamecard/GameCard";
const GameList = ({ mode }: { mode: boolean }) => {
  return (
    <div
      className={
        mode === true ? `${styles.gamelist} ${styles.light}` : styles.gamelist
      }
    >
      <Wrapper>
        <h2>Play other games</h2>
        <div className={styles.listOfGames}>
            <GameCard/>
        </div>
      </Wrapper>
    </div>
  );
};

export default GameList;
