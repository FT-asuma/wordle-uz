"use client";
import GameContainer from "@/components/container/GameContainer";
import styles from "./page.module.css";
import Header from "@/components/blocks/Header";
import Game from "@/components/game/Game";
import { useEffect, useState } from "react";
import words from "an-array-of-english-words";

// import { db } from "./firebase/config";
import { collection, getDocs } from "firebase/firestore";

// async function fetchDataFire() {
//   const query = await getDocs(collection(db, "users"));

//   const data: any[] = [];
//   query.forEach((doc) => {
//     data.push({ id: doc.id, ...doc.data() });
//   });
//   return data;
// }

export default function Home() {
  const [wordLength, setWordLength] = useState(4);
  const [loading, setLoading] = useState(true);
  const [listOfWords, setListOfWords] = useState<string[]>([]);
  const [hiddenWord, setHiddenWord] = useState<string>("");
  const [list, setList] = useState<Array<string>>(["", "", "", ""]);
  const [confetti, setConfetti] = useState(true);
  const [swap, setSwap] = useState(false);

  const [userData, setUserData] = useState<any[]>([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await fetchDataFire();
  //     setUserData(data);
  //   }
  //   fetchData();
  // }, []);
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
  useEffect(() => {
    const swapL = localStorage.getItem("swap");
    // console.log(swapL)
    if (swapL) {
      if (swapL === "true") {
        setSwap(true);
        console.log("wefwef", swap);
      } else {
        console.log("wefwef", swap);
        setSwap(false);
      }
    }
    const confettiL = localStorage.getItem("confetti");
    if (confettiL) {
      if (confettiL === "true") {
        setConfetti(true);
      } else {
        setConfetti(false);
      }
    }
  }, []);
  useEffect(() => {
    if (swap === true) {
      localStorage.setItem("swap", `${swap}`);
    } else {
      localStorage.setItem("swap", `${swap}`);
    }
    if (confetti === true) {
      localStorage.setItem("confetti", `${confetti}`);
    } else {
      localStorage.setItem("confetti", `${confetti}`);
    }
  }, [swap, confetti]);

  if (loading === true && hiddenWord && document && document.body) {
    return <div>Loading...</div>;
  } else {
    return (
      <main className={styles.main}>
        <GameContainer>
          <Header
            setConfetti={setConfetti}
            confetti={confetti}
            setSwap={setSwap}
            swap={swap}
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
            setHiddenWord={setHiddenWord}
          />
        </GameContainer>
      </main>
    );
  }
}
