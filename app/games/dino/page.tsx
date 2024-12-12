"use client";
import { useEffect, useState } from "react";

import styles from "./dino.module.css";

const DinoGame = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [obstaclePosition, setObstaclePosition] = useState(600);
  const [dinoBottom, setDinoBottom] = useState(20);

  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      let jumpHeight = 0;
      const jumpInterval = setInterval(() => {
        if (jumpHeight < 100) {
          setDinoBottom((prev) => prev + 5);
          jumpHeight += 5;
        } else {
          clearInterval(jumpInterval);
          fall();
        }
      }, 20);
    }
  };

  const fall = () => {
    let fallHeight = 100;
    const fallInterval = setInterval(() => {
      if (fallHeight > 0) {
        setDinoBottom((prev) => prev - 5);
        fallHeight -= 5;
      } else {
        clearInterval(fallInterval);
        setIsJumping(false);
      }
    }, 20);
  };

  const detectCollision = () => {
    if (obstaclePosition > 50 && obstaclePosition < 80 && dinoBottom <= 60) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        setObstaclePosition((prev) => prev - 5);
        if (obstaclePosition <= 0) {
          setObstaclePosition(600);
        }
        detectCollision();
      }
    }, 20);
    return () => clearInterval(interval);
  }, [obstaclePosition, gameOver, dinoBottom]);

  const restartGame = () => {
    setGameOver(false);
    setObstaclePosition(600);
    setDinoBottom(20);
  };

  return (
    <div className={styles.gameContainer}>
      <div
        className={styles.dino}
        style={{
          bottom: `${dinoBottom}px`,
        }}
      />
      <div className={styles.ground} />
      <div
        className={styles.obstacle}
        style={{
          right: `${obstaclePosition}px`,
        }}
      />
      {gameOver && (
        <div className={styles.gameOver}>
          Game Over! <button onClick={restartGame}>Restart</button>
        </div>
      )}
      <button onClick={jump} className={styles.jumpButton}>
        Jump
      </button>
    </div>
  );
};

export default DinoGame;
