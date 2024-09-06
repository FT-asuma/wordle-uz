import GameContainer from "@/components/container/GameContainer";
import styles from "./page.module.css";
import Header from "@/components/blocks/Header";
import Game from "@/components/game/Game";

export default function Home() {
  return (
    <main className={styles.main}>
      <GameContainer>
        <Header/>
        <Game/>
      </GameContainer>
    </main>
  );
}
