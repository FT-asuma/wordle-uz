import React from "react";
import styles from "./gamecard.module.css";
import Link from "next/link";
import Image from "next/image";
const GameCard = () => {
  return (
    <Link href={"/games/doubletrouble"} className={styles.card}>
      <div className={styles.icon}>
        <Image
          src={"/cards/double.png"}
          alt="double trouble image"
          width={300}
          height={300}
        />
      </div>
      <div className={styles.content}>
        <h3>Double Trouble</h3>
        <p>Double the challenge, double the fun</p>
        <button>Play</button>
      </div>
    </Link>
  );
};

export default GameCard;
