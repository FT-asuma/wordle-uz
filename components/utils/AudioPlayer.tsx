"use client";
import React, { useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa"; // Import play and pause icons
import styles from "./utils.module.css"; // Import CSS module

interface AudioPlayerProps {
  word: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ word }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  );
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const fetchAudio = async () => {
      if (word) {
        setLoading(true); // Set loading to true when fetching audio
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
            setAudioUrl(null); // If no valid audio found, set it to null
          }
        } catch (error) {
          console.error("Error fetching audio:", error);
        } finally {
          setLoading(false); // Set loading to false once fetching is done
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
        <div className={styles.loading}></div> // Show loading spinner
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
