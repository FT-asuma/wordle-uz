"use client";
import React, { useState, useEffect } from "react";

import styles from "./utils.module.css";

import { FaPlay, FaPause } from "react-icons/fa";

interface AudioPlayerProps {
  word: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ word }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAudio = async () => {
      if (word) {
        setLoading(true); 
        try {
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
          );
          const data = await response.json();
          const validPhonetic = data[0]?.phonetics.find(
            (phonetic: any) => phonetic.audio
          );
          if (validPhonetic) {
            setAudioUrl(validPhonetic.audio);
          } else {
            setAudioUrl(null); 
          }
        } catch (error) {
          console.error("Error fetching audio:", error);
        } finally {
          setLoading(false); 
        }
      }
    };

    fetchAudio();
  }, [word]);

  const handlePlay = () => {
    if (audioUrl) {
      if (!audioInstance) {
        const audio = new Audio(audioUrl);
        setAudioInstance(audio);

        audio.play();
        setIsPlaying(true);

        audio.onended = () => {
          setIsPlaying(false);
          setAudioInstance(null);
        };
      } else {
        audioInstance.pause();
        setIsPlaying(false);
        setAudioInstance(null);
      }
    }
  };

  return (
    <div className={styles.audioPlayer}>
      {loading ? (
        <div className={styles.loading}></div>
      ) : audioUrl ? (
        <button onClick={handlePlay} className={styles.playBtn}>
          {isPlaying ? (
            <FaPause className={`${styles.icon} ${styles.pauseIcon}`} />
          ) : (
            <FaPlay className={`${styles.icon} ${styles.playIcon}`} />
          )}
        </button>
      ) : (
        <p>
          <i>No audio available</i>
        </p>
      )}
    </div>
  );
};

export default AudioPlayer;