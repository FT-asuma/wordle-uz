// components
import { Header, GameContainer, Game } from "@/components";
import { Footer } from "@/components/blocks";

export default function Home() {
  return (
    <GameContainer>
      <Header />
      <Game />
      <Footer/>
    </GameContainer>
  );
}
