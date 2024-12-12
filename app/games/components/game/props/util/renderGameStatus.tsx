import styles from "../../game.module.css";

import { ILetterData } from "@/interface";
interface IPrevList {
  prev: [ILetterData];
}

const renderGameStatus = ({
  prevList,
  text,
}: {
  prevList: IPrevList[];
  text: string;
}) => {
  if (prevList?.length > 0) {
    switch (text) {
      case "won! 🏆":
        return <p className={styles.reward}>You Won! 🏆</p>;
      case "lost!":
        return <p className={styles.reward}>You lost!</p>;
      default:
        return <p style={{ height: 28 }} />;
    }
  }
  return <p style={{ height: 28 }}></p>;
};
export default renderGameStatus;
