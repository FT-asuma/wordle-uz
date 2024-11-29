"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./blocks.module.css";
import Switcher from "../utils/Switcher";
import { useRouter } from "next/navigation";
import { FaTrophy } from "react-icons/fa";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { FaUser } from "react-icons/fa";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
const Header = ({
  setWordLength,
  wordLength,
  setList,
  setConfetti,
  confetti,
  setSwap,
  swap,
  mode,
  setMode,
}: {
  setWordLength: Dispatch<SetStateAction<number>>;
  wordLength: number;
  setList: Dispatch<SetStateAction<string[]>>;
  setConfetti: Dispatch<SetStateAction<boolean>>;
  confetti: boolean;
  setSwap: Dispatch<SetStateAction<boolean>>;
  swap: boolean;
  setMode: Dispatch<SetStateAction<boolean>>;
  mode: boolean;
}) => {
  const [isSettingsOpen, setisSettingsOpen] = useState(false);
  const [isInfoOpen, setisInfoOpen] = useState(false);
  const [isStatsOpen, setisStatsOpen] = useState(false);
  const { push } = useRouter();
  const [index, setIndex] = useState<number>();
  const [pending, setPending] = useState(true);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [user, setUser] = useState<User>();
  const [profileModal, setProfileModal] = useState(false);
  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, orderBy("wins", "desc"), limit(10)); // Query to get top 10 players by wins
        const querySnapshot = await getDocs(q);

        const players = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTopPlayers(players);
        setPending(false);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchTopPlayers();
  }, [isStatsOpen]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
      }
    });
  }, []);
  useEffect(() => {
    if (user && topPlayers && topPlayers.length) {
      const index = topPlayers.findIndex((u) => u.email === user.email);
      if (index !== -1) {
        setIndex(index);
      }
    }
  }, [topPlayers, user]);
  return (
    <header className={styles.header}>
      <div className={styles.wrapperTabs}>
        <button
          style={{ color: mode ? "#414a5e" : "#e0e1dd" }}
          className={`${styles.tabs} ${mode ? styles.lightTabs : ""}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            className="iconify iconify--twemoji"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              fill="#B22334"
              d="M35.445 7C34.752 5.809 33.477 5 32 5H18v2h17.445zM0 25h36v2H0zm18-8h18v2H18zm0-4h18v2H18zM0 21h36v2H0zm4 10h28c1.477 0 2.752-.809 3.445-2H.555c.693 1.191 1.968 2 3.445 2zM18 9h18v2H18z"
            ></path>
            <path
              fill="#EEE"
              d="M.068 27.679c.017.093.036.186.059.277c.026.101.058.198.092.296c.089.259.197.509.333.743L.555 29h34.89l.002-.004a4.22 4.22 0 0 0 .332-.741a3.75 3.75 0 0 0 .152-.576c.041-.22.069-.446.069-.679H0c0 .233.028.458.068.679zM0 23h36v2H0zm0-4v2h36v-2H18zm18-4h18v2H18zm0-4h18v2H18zM0 9zm.555-2l-.003.005L.555 7zM.128 8.044c.025-.102.06-.199.092-.297a3.78 3.78 0 0 0-.092.297zM18 9h18c0-.233-.028-.459-.069-.68a3.606 3.606 0 0 0-.153-.576A4.21 4.21 0 0 0 35.445 7H18v2z"
            ></path>
            <path fill="#3C3B6E" d="M18 5H4a4 4 0 0 0-4 4v10h18V5z"></path>
            <path
              fill="#FFF"
              d="M2.001 7.726l.618.449l-.236.725L3 8.452l.618.448l-.236-.725L4 7.726h-.764L3 7l-.235.726zm2 2l.618.449l-.236.725l.617-.448l.618.448l-.236-.725L6 9.726h-.764L5 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 9l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 9l-.235.726zm-8 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L5 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L9 13l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L13 13l-.235.726zm-6-6l.618.449l-.236.725L7 8.452l.618.448l-.236-.725L8 7.726h-.764L7 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 7l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 7l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 11l-.235.726zM6.383 12.9L7 12.452l.618.448l-.236-.725l.618-.449h-.764L7 11l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 11l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 11l-.235.726zm-12 4l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L3 15l-.235.726zM6.383 16.9L7 16.452l.618.448l-.236-.725l.618-.449h-.764L7 15l-.235.726h-.764l.618.449zm3.618-1.174l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L11 15l-.235.726zm4 0l.618.449l-.236.725l.617-.448l.618.448l-.236-.725l.618-.449h-.764L15 15l-.235.726z"
            ></path>
          </svg>
          en
        </button>
        <button
          style={
            profileModal === true
              ? { background: "#007f5f90", transition: "0.3s" }
              : { transition: "0.3s" }
          }
          onClick={() => {
            setProfileModal(!profileModal);
            setisInfoOpen(false);
            setisSettingsOpen(false);
            setisStatsOpen(false);
          }}
          className={
            mode === false ? styles.tabs : `${styles.tabs} ${styles.lightTabs}`
          }
        >
          <FaUser
            fontSize={16}
            color={profileModal ? "#0af025" : mode ? "#414a5e" : "#e0e1dd"}
          />
        </button>
        <div
          style={{
            height: profileModal ? 600 : 0,
            opacity: 1,
            zIndex: profileModal ? 100 : -10,
            transition: "0.2s",
          }}
          className={`${styles.modal} ${mode && styles.lightMode}`}
        >
          <div
            style={{
              opacity: profileModal ? 1 : 0,
              transition: "0.3s",
            }}
            className={styles.container}
          >
            <div className={styles.title}>
              <span></span>
              <h2>
                Welcome -{" "}
                {user
                  ? user.displayName?.split(" ")[0]
                  : `Player${Math.floor(Math.random() * 10000)}`}{" "}
                {index === 0 && (
                  <FaTrophy color="gold" size={20} className={styles.icon} />
                )}
                {index === 1 && (
                  <FaTrophy color="silver" size={20} className={styles.icon} />
                )}
                {index === 2 && (
                  <FaTrophy color="bronze" size={20} className={styles.icon} />
                )}
                !
              </h2>
              <button onClick={() => setProfileModal(false)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 1024 1024"
                  fill={mode ? "#414a5e" : "#e0e1dd"}
                  className="icon"
                >
                  <path d="M176.662 817.173c-8.19 8.471-7.96 21.977 0.51 30.165 8.472 8.19 21.978 7.96 30.166-0.51l618.667-640c8.189-8.472 7.96-21.978-0.511-30.166-8.471-8.19-21.977-7.96-30.166 0.51l-618.666 640z" />
                  <path d="M795.328 846.827c8.19 8.471 21.695 8.7 30.166 0.511 8.471-8.188 8.7-21.694 0.511-30.165l-618.667-640c-8.188-8.471-21.694-8.7-30.165-0.511-8.471 8.188-8.7 21.694-0.511 30.165l618.666 640z" />
                </svg>
              </button>
            </div>
            <div className={styles.profile}>
              {user ? (
                <div className={styles.profileContent}>
                  <div className={styles.avatarSection}>
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt={user.displayName || "User"}
                      className={styles.avatarImage}
                    />
                  </div>
                  <div className={styles.detailsSection}>
                    <div className={styles.detailRow}>
                      <strong>Name:</strong> {user.displayName || "Player"}
                    </div>
                    <div className={styles.detailRow}>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div className={styles.detailRow}>
                      <strong>Joined:</strong>{" "}
                      {user.metadata.creationTime &&
                        new Date(
                          user.metadata.creationTime
                        ).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{marginTop: 16}} className={styles.information}>
                    Dear {user.displayName}! <br />
                    Thanks for you attendence in our game! <br />
                    {index! > 1 && `You won ${index} times!!!`} <br />
                    Keep it up <b>Player</b>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => push("/auth")}
                  className={styles.registerBtn}
                >
                  Register
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.wrapperTabs}>
        <button
          className={
            mode === false ? styles.tabs : `${styles.tabs} ${styles.lightTabs}`
          }
          style={
            isStatsOpen === true
              ? { background: "#007f5f90", transition: "0.3s" }
              : { transition: "0.3s" }
          }
          onClick={() => {
            setisStatsOpen(!isStatsOpen);
            setisInfoOpen(false);
            setisSettingsOpen(false);
            setProfileModal(false);
          }}
        >
          <svg
            fill={isStatsOpen ? "#0af025" : mode ? "#414a5e" : "#e0e1dd"}
            width="24"
            height="24"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#e0e1dd"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <title>ionicons-v5-q</title>
              <path d="M104,496H72a24,24,0,0,1-24-24V328a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,104,496Z"></path>
              <path d="M328,496H296a24,24,0,0,1-24-24V232a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,328,496Z"></path>
              <path d="M440,496H408a24,24,0,0,1-24-24V120a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,440,496Z"></path>
              <path d="M216,496H184a24,24,0,0,1-24-24V40a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,216,496Z"></path>
            </g>
          </svg>
        </button>
        <div
          style={{
            height: isStatsOpen ? 600 : 0,
            opacity: 1,
            zIndex: isStatsOpen ? 100 : -10,
            transition: "0.2s",
          }}
          className={`${styles.modal} ${mode && styles.lightMode}`}
        >
          <div
            style={{
              opacity: isStatsOpen ? 1 : 0,
              transition: "0.3s",
            }}
            className={styles.container}
          >
            <div className={styles.title}>
              <span></span>
              <h2>Top 10 players</h2>
              <button onClick={() => setisStatsOpen(false)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 1024 1024"
                  fill={mode ? "#414a5e" : "#e0e1dd"}
                  className="icon"
                >
                  <path d="M176.662 817.173c-8.19 8.471-7.96 21.977 0.51 30.165 8.472 8.19 21.978 7.96 30.166-0.51l618.667-640c8.189-8.472 7.96-21.978-0.511-30.166-8.471-8.19-21.977-7.96-30.166 0.51l-618.666 640z" />
                  <path d="M795.328 846.827c8.19 8.471 21.695 8.7 30.166 0.511 8.471-8.188 8.7-21.694 0.511-30.165l-618.667-640c-8.188-8.471-21.694-8.7-30.165-0.511-8.471 8.188-8.7 21.694-0.511 30.165l618.666 640z" />
                </svg>
              </button>
            </div>
            <div className={styles.playersList}>
              {pending === true ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                </div>
              ) : (
                topPlayers
                  .filter((pl) => pl.wins > 0)
                  .map((player, index) => {
                    const playerRankClass =
                      index === 0
                        ? styles.top1
                        : index === 1
                        ? styles.top2
                        : index === 2
                        ? styles.top3
                        : "";

                    return (
                      <div className={styles.player} key={player.id}>
                        {/* <hr className={styles.separator} /> */}
                        <div
                          className={`${styles.playerItem} ${playerRankClass}`}
                        >
                          <div className={styles.leftSide}>
                            <div className={styles.username}>
                              <img
                                src={player.photoURL || "/default-user.png"}
                                alt={player.displayName}
                                className={`${styles.avatar} ${playerRankClass}`}
                              />
                              {player.displayName.split(" ")[0]}
                              {index === 0 && (
                                <FaTrophy
                                  color="gold"
                                  size={20}
                                  className={styles.icon}
                                />
                              )}
                              {index === 1 && (
                                <FaTrophy
                                  color="silver"
                                  size={20}
                                  className={styles.icon}
                                />
                              )}
                              {index === 2 && (
                                <FaTrophy
                                  color="bronze"
                                  size={20}
                                  className={styles.icon}
                                />
                              )}
                            </div>
                            <div className={styles.email}>{player.email}</div>
                          </div>
                          <div className={styles.rightSide}>
                            <div className={styles.winRate}>
                              Wins: <b>{player.wins}</b>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setisSettingsOpen(!isSettingsOpen);
            setisInfoOpen(false);
            setisStatsOpen(false);
            setProfileModal(false);
          }}
          style={
            isSettingsOpen === true
              ? { background: "#007f5f90", transition: "0.3s" }
              : { transition: "0.3s" }
          }
          className={
            mode === false ? styles.tabs : `${styles.tabs} ${styles.lightTabs}`
          }
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke={
                  mode === false && isSettingsOpen === false
                    ? "#e0e1dd"
                    : mode === true && isSettingsOpen === false
                    ? "#414a5e"
                    : isSettingsOpen === true
                    ? "#0af025"
                    : "#e0e1dd"
                }
                strokeWidth="1.5"
              ></circle>{" "}
              <path
                d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
                stroke={
                  mode === false && isSettingsOpen === false
                    ? "#e0e1dd"
                    : mode === true && isSettingsOpen === false
                    ? "#414a5e"
                    : isSettingsOpen === true
                    ? "#0af025"
                    : "#e0e1dd"
                }
                strokeWidth="1.5"
              ></path>{" "}
            </g>
          </svg>
        </button>
        <div
          style={{
            height: isSettingsOpen ? 600 : 0,
            opacity: 1,
            zIndex: isSettingsOpen ? 100 : -10,
            transition: "0.2s",
          }}
          className={`${styles.modal} ${mode && styles.lightMode}`}
        >
          <div
            style={{
              opacity: isSettingsOpen ? 1 : 0,
              transition: "0.3s",
            }}
            className={styles.container}
          >
            <div className={styles.title}>
              <span></span>
              <h2>Settings</h2>
              <button onClick={() => setisSettingsOpen(false)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 1024 1024"
                  fill={mode ? "#414a5e" : "#e0e1dd"}
                  className="icon"
                >
                  <path d="M176.662 817.173c-8.19 8.471-7.96 21.977 0.51 30.165 8.472 8.19 21.978 7.96 30.166-0.51l618.667-640c8.189-8.472 7.96-21.978-0.511-30.166-8.471-8.19-21.977-7.96-30.166 0.51l-618.666 640z" />
                  <path d="M795.328 846.827c8.19 8.471 21.695 8.7 30.166 0.511 8.471-8.188 8.7-21.694 0.511-30.165l-618.667-640c-8.188-8.471-21.694-8.7-30.165-0.511-8.471 8.188-8.7 21.694-0.511 30.165l618.666 640z" />
                </svg>
              </button>
            </div>
            <h3>Number of Letters</h3>
            <div className={styles.buttonRaw}>
              {[4, 5, 6, 7, 8, 9, 10].map((length) => (
                <button
                  key={length ** 2 + Math.random() / 23}
                  style={
                    wordLength === length
                      ? {
                          background: "#007f5f",
                          fontWeight: 700,
                          color: "#fff",
                        }
                      : {}
                  }
                  onClick={() => {
                    setWordLength(length);
                    setList(Array(length).fill(""));
                  }}
                >
                  {length}
                </button>
              ))}
            </div>
            <div className={styles.furtherSettings}>
              <hr />
              {[
                {
                  title: "Confetti Animation",
                  description:
                    "Confetti animation when you find the hidden word",
                  setter: setConfetti,
                  value: confetti,
                  key: "confetti-animation", // Specific key for this setting
                },
                {
                  title: "Swap Buttons",
                  description: "Swap Enter and Backspace buttons",
                  setter: setSwap,
                  value: swap,
                  key: "swap-buttons", // Specific key for this setting
                },
                {
                  title: "Screen mode",
                  description: "Change the color of mode to dark/light",
                  setter: setMode,
                  value: mode,
                  key: "screen-mode", // Specific key for this setting
                },
              ].map(({ title, description, setter, value, key }, index) => (
                <div key={key}>
                  <div className={styles.additional}>
                    <div className={styles.aside}>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                    <div className={styles.besides}>
                      <Switcher setter={setter} value={value} />
                    </div>
                  </div>
                  {index < 2 && <hr key={`hr-${key}`} />}{" "}
                  {/* Use a unique key for hr */}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setisInfoOpen(!isInfoOpen);
            setisSettingsOpen(false);
            setisStatsOpen(false);
            setProfileModal(false);
          }}
          style={
            isInfoOpen
              ? {
                  background: "#007f5f90",
                  transition: "0.3s",
                }
              : {
                  transition: "0.3s",
                }
          }
          className={`${styles.tabs} ${mode ? styles.lightTabs : ""}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            fill={isInfoOpen ? "#0af025" : mode ? "#414a5e" : "#e0e1dd"}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                  <rect width="48" height="48" fill="none"></rect>
                </g>
                <g id="Icons">
                  <g>
                    <path d="M27.2,34.8l-4.5.4s2.2-7.9,3.8-13.2a4.1,4.1,0,0,0-3.6-5.5,3.6,3.6,0,0,0-2.7,1.2l-4,3.3a.7.7,0,0,0,.6,1.2l4.5-.4L17.5,35a4.1,4.1,0,0,0,3.6,5.5,3.6,3.6,0,0,0,2.7-1.2l4-3.3A.7.7,0,0,0,27.2,34.8Z"></path>
                    <circle cx="26" cy="11" r="3"></circle>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </button>
        <div
          style={
            isInfoOpen === false
              ? { height: 0, opacity: 1, zIndex: -10, transition: "0.2s" }
              : {
                  zIndex: 100,
                  opacity: 1,
                  height: 600,
                  transition: "0.2s",
                }
          }
          className={
            mode === false
              ? styles.modal
              : `${styles.modal} ${styles.lightMode}`
          }
        >
          <div
            style={
              isInfoOpen === true
                ? { opacity: 1, transition: "0.3s" }
                : { opacity: 0, transition: "0.3s" }
            }
            className={styles.container}
          >
            <div className={styles.title}>
              <span></span>
              <h2>How to get started</h2>
              <button
                onClick={() => {
                  setisInfoOpen(false);
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 1024 1024"
                  fill={mode === false ? "#e0e1dd" : "#414a5e"}
                  className="icon"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth=""></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M176.662 817.173c-8.19 8.471-7.96 21.977 0.51 30.165 8.472 8.19 21.978 7.96 30.166-0.51l618.667-640c8.189-8.472 7.96-21.978-0.511-30.166-8.471-8.19-21.977-7.96-30.166 0.51l-618.666 640z"
                      fill=""
                    ></path>
                    <path
                      d="M795.328 846.827c8.19 8.471 21.695 8.7 30.166 0.511 8.471-8.188 8.7-21.694 0.511-30.165l-618.667-640c-8.188-8.471-21.694-8.7-30.165-0.511-8.471 8.188-8.7 21.694-0.511 30.165l618.666 640z"
                      fill=""
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
            <h3></h3>
            <div className={styles.description}>
              <p style={{ textAlign: "center", fontSize: 14 }}>
                You need to guess the secret word in 6 attempts, with the letter
                colors changing to indicate how close your guess is.
              </p>
              <p style={{ textAlign: "center", fontSize: 14 }}>
                To begin the game, simply type any word, such as:
              </p>
            </div>
            <div className={styles.sample}>
              {["P", "L", "A", "N", "T"].map((i) => {
                return (
                  <div
                    key={`${i + Math.random()}`}
                    style={{ width: 54 }}
                    className={styles.letterCont}
                  >
                    <span
                      style={mode === true ? { color: "#2e3239 " } : {}}
                      className={styles.letter}
                    >
                      {i}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={styles.showcase}>
              <div className={styles.case}>
                <p>
                  The letters <code>P</code> and <code>A</code> are not present
                  in the target word.
                </p>
                <p>
                  The letters <code>L</code> and <code>N</code> are in the word,
                  but in the wrong positions.
                </p>
                <p>
                  The letter <code>T</code> is in the word and is in the correct
                  position.
                </p>
              </div>
            </div>
            <div className={styles.description}>
              <p style={{ textAlign: "center", fontSize: 14 }}>
                Another attempt to identify the correct letters in the target
                word.
              </p>
            </div>
            <div className={styles.sample2}>
              {["G", "R", "A", "N", "D"].map((i) => {
                return (
                  <div
                    key={`${i}${Math.random()}`}
                    style={{ width: 54 }}
                    className={styles.letterCont}
                  >
                    <span
                      style={mode === true ? { color: "#2e3239 " } : {}}
                      className={styles.letter}
                    >
                      {i}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={styles.description}>
              <p style={{ textAlign: "center", fontSize: 14 }}>Almost there!</p>
            </div>
            <div className={styles.sample}>
              {["G", "R", "A", "P", "E"].map((i) => {
                return (
                  <div
                    key={`${i}${Math.random()}`}
                    style={{
                      width: 54,
                      background: "#4caf50",
                      borderColor: "#4caf50",
                    }}
                    className={styles.letterCont}
                  >
                    <span
                      style={mode === true ? { color: "#2e3239 " } : {}}
                      className={styles.letter}
                    >
                      {i}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={styles.description}>
              <p style={{ textAlign: "center", fontSize: 14, fontWeight: 700 }}>
                Great Job! 🏆
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
