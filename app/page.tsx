"use client";
import GameContainer from "@/components/container/GameContainer";
import styles from "./page.module.css";
import Header from "@/components/blocks/Header";
import Game from "@/components/game/Game";
import { useEffect, useState } from "react";
import words from "an-array-of-english-words";
export default function Home() {
  const [wordLength, setWordLength] = useState(4);
  const [loading, setLoading] = useState(true);
  const [listOfWords, setListOfWords] = useState<string[]>([]);
  const [hiddenWord, setHiddenWord] = useState<string>();
  const [list, setList] = useState<Array<string>>(["", "", "", ""]);
  useEffect(() => {
    if (words) {
      const response = words.filter((word) => word.length === list.length);
      setHiddenWord(randomWord(response, 1, response.length));
      setListOfWords(response);
      setLoading(false);
    }
  }, []);

  const randomWord = (list: string[], min: number, max: number) => {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return list[random];
  };
  useEffect(() => {
    if (wordLength) {
      const response = words.filter((word) => word.length === wordLength);
      setHiddenWord(randomWord(response, 1, response.length));
      setListOfWords(response);
    }
  }, [wordLength]);
  if (loading === true && hiddenWord && document && document.body) {
    return (
      <div>
        <button
          onClick={() => {
            setWordLength(wordLength + 1);
          }}
        >
          Click nigga here
        </button>
      </div>
    );
  } else {
    return (
      <main className={styles.main}>
        <GameContainer>
          <Header
            setList={setList}
            setWordLength={setWordLength}
            wordLength={wordLength}
          />
          <Game
            setWordLength={setWordLength}
            wordLength={wordLength}
            listOfWords={listOfWords}
            hiddenWord={hiddenWord!}
            lengthOfWord={list}
          />
        </GameContainer>
      </main>
    );
  }
}
