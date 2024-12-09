"use client";
import React, { useEffect, useState } from "react";

import styles from "./utils.module.css";

import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useAppContext } from "@/context/AppContext";

const StatsModal = ({
  isStatsOpen,
  setisStatsOpen,
}: {
  isStatsOpen: boolean;
  setisStatsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mode } = useAppContext();
  const [topPlayers, setTopPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, orderBy("wins", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        const players = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTopPlayers(players);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchTopPlayers();
  }, []);

  return (
    <div
      style={
        isStatsOpen === false
          ? { height: 0, opacity: 1, zIndex: -10, transition: "0.2s" }
          : { zIndex: 100, opacity: 1, height: 600, transition: "0.2s" }
      }
      className={
        mode === false ? styles.modal : `${styles.modal} ${styles.lightMode}`
      }
    >
      <div
        style={
          isStatsOpen === true
            ? { opacity: 1, transition: "0.3s" }
            : { opacity: 0, transition: "0.3s" }
        }
        className={styles.container}
      >
        <div className={styles.title}>
          <span></span>
          <h2>Top 10 Players</h2>
          <button
            className={styles.button}
            onClick={() => {
              setisStatsOpen(false);
            }}
          >
            {/* Close button SVG */}
          </button>
        </div>

        <div className={styles.statsList}>
          {topPlayers.length === 0 ? (
            <p>No players found</p>
          ) : (
            topPlayers.map((player, index) => (
              <div key={player.id} className={styles.playerItem}>
                <span>
                  {index + 1}. {player.username}
                </span>
                <span>Wins: {player.wins}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
