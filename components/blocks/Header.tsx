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
  const [authModal, setAuthModal] = useState(false);
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M20.4329 14.1733C20.4772 13.7615 20.1792 13.3917 19.7674 13.3474C19.3556 13.3031 18.9858 13.601 18.9415 14.0129L20.4329 14.1733ZM4.3128 14.0931L3.5671 14.1733L4.3128 14.0931ZM4.12945 12.3884L4.87514 12.3082L4.12945 12.3884ZM8.76006 10.934L9.41507 11.2993L8.76006 10.934ZM10.5495 7.7254L9.89453 7.36008L10.5495 7.7254ZM13.4505 7.7254L12.7954 8.09071L13.4505 7.7254ZM15.2399 10.934L15.895 10.5686V10.5686L15.2399 10.934ZM16.0038 11.9592L15.7015 12.6456L15.7015 12.6456L16.0038 11.9592ZM17.4705 11.2451L16.9412 10.7138L17.4705 11.2451ZM16.4533 12.0219L16.3506 11.2789L16.3506 11.2789L16.4533 12.0219ZM6.5295 11.2451L6.0002 11.7765L6.5295 11.2451ZM7.5467 12.0219L7.64943 11.2789L7.64943 11.2789L7.5467 12.0219ZM7.99621 11.9592L8.29846 12.6456L8.29846 12.6456L7.99621 11.9592ZM5.71208 20.1532L6.21228 19.5943H6.21228L5.71208 20.1532ZM18.2879 20.1532L17.7877 19.5943L18.2879 20.1532ZM19.9823 10.4999L19.9736 11.2498L19.9823 10.4999ZM18.8645 9.98013L19.432 9.48982L18.8645 9.98013ZM12.9077 6.78265L12.5668 6.11457L12.9077 6.78265ZM11.0923 6.78265L11.4332 6.11457L11.0923 6.78265ZM13.0879 20.25H10.9121V21.75H13.0879V20.25ZM5.0585 14.0129L4.87514 12.3082L3.38375 12.4686L3.5671 14.1733L5.0585 14.0129ZM9.41507 11.2993L11.2046 8.09072L9.89453 7.36008L8.10504 10.5686L9.41507 11.2993ZM12.7954 8.09071L14.5849 11.2993L15.895 10.5686L14.1055 7.36008L12.7954 8.09071ZM14.5849 11.2993C14.7467 11.5893 14.8956 11.8582 15.0399 12.0638C15.1885 12.2753 15.3911 12.5089 15.7015 12.6456L16.306 11.2728C16.3619 11.2973 16.3524 11.3226 16.2675 11.2018C16.1784 11.0749 16.0727 10.8873 15.895 10.5686L14.5849 11.2993ZM16.9412 10.7138C16.6825 10.9715 16.529 11.1231 16.4082 11.2208C16.2931 11.3139 16.2906 11.2872 16.3506 11.2789L16.556 12.7648C16.8918 12.7184 17.1507 12.5495 17.3517 12.3869C17.547 12.2289 17.7642 12.0112 17.9998 11.7765L16.9412 10.7138ZM15.7015 12.6456C15.9698 12.7637 16.2657 12.8049 16.556 12.7648L16.3506 11.2789C16.3353 11.281 16.3199 11.2789 16.306 11.2728L15.7015 12.6456ZM6.0002 11.7765C6.23578 12.0112 6.453 12.2289 6.64834 12.3869C6.84933 12.5495 7.10824 12.7184 7.44397 12.7648L7.64943 11.2789C7.70944 11.2872 7.7069 11.3139 7.5918 11.2208C7.47104 11.1231 7.31753 10.9715 7.05879 10.7138L6.0002 11.7765ZM8.10504 10.5686C7.92732 10.8873 7.82158 11.0749 7.7325 11.2018C7.64765 11.3226 7.63814 11.2973 7.69395 11.2728L8.29846 12.6456C8.60887 12.5089 8.81155 12.2753 8.96009 12.0638C9.10441 11.8583 9.2533 11.5893 9.41507 11.2993L8.10504 10.5686ZM7.44397 12.7648C7.73429 12.8049 8.03016 12.7637 8.29846 12.6456L7.69395 11.2728C7.68011 11.2789 7.66466 11.281 7.64943 11.2789L7.44397 12.7648ZM10.9121 20.25C9.47421 20.25 8.46719 20.2486 7.69857 20.1502C6.9509 20.0545 6.52851 19.8774 6.21228 19.5943L5.21187 20.712C5.84173 21.2758 6.60137 21.522 7.50819 21.6381C8.39406 21.7514 9.51399 21.75 10.9121 21.75V20.25ZM3.5671 14.1733C3.71526 15.5507 3.83282 16.8999 4.03322 17.994C4.1343 18.5459 4.26178 19.0659 4.43833 19.5172C4.61339 19.9648 4.8549 20.3925 5.21187 20.712L6.21228 19.5943C6.0962 19.4904 5.96405 19.3 5.83525 18.9708C5.70795 18.6454 5.60138 18.2299 5.50868 17.7238C5.32149 16.7018 5.21246 15.4443 5.0585 14.0129L3.5671 14.1733ZM18.9415 14.0129C18.7875 15.4443 18.6785 16.7018 18.4913 17.7238C18.3986 18.2299 18.292 18.6454 18.1647 18.9708C18.036 19.3 17.9038 19.4904 17.7877 19.5943L18.7881 20.712C19.1451 20.3925 19.3866 19.9648 19.5617 19.5172C19.7382 19.0659 19.8657 18.5459 19.9668 17.994C20.1672 16.8999 20.2847 15.5507 20.4329 14.1733L18.9415 14.0129ZM13.0879 21.75C14.486 21.75 15.6059 21.7514 16.4918 21.6381C17.3986 21.522 18.1583 21.2758 18.7881 20.712L17.7877 19.5943C17.4715 19.8774 17.0491 20.0545 16.3014 20.1502C15.5328 20.2486 14.5258 20.25 13.0879 20.25V21.75ZM10.75 5C10.75 4.30964 11.3096 3.75 12 3.75V2.25C10.4812 2.25 9.25 3.48122 9.25 5H10.75ZM12 3.75C12.6904 3.75 13.25 4.30964 13.25 5H14.75C14.75 3.48122 13.5188 2.25 12 2.25V3.75ZM20.75 9C20.75 9.41421 20.4142 9.75 20 9.75V11.25C21.2426 11.25 22.25 10.2426 22.25 9H20.75ZM19.25 9C19.25 8.58579 19.5858 8.25 20 8.25V6.75C18.7574 6.75 17.75 7.75736 17.75 9H19.25ZM20 8.25C20.4142 8.25 20.75 8.58579 20.75 9H22.25C22.25 7.75736 21.2426 6.75 20 6.75V8.25ZM4 9.75C3.58579 9.75 3.25 9.41421 3.25 9H1.75C1.75 10.2426 2.75736 11.25 4 11.25V9.75ZM3.25 9C3.25 8.58579 3.58579 8.25 4 8.25V6.75C2.75736 6.75 1.75 7.75736 1.75 9H3.25ZM4 8.25C4.41421 8.25 4.75 8.58579 4.75 9H6.25C6.25 7.75736 5.24264 6.75 4 6.75V8.25ZM20 9.75C19.997 9.75 19.994 9.74998 19.991 9.74995L19.9736 11.2498C19.9824 11.2499 19.9912 11.25 20 11.25V9.75ZM19.991 9.74995C19.7681 9.74737 19.5689 9.64827 19.432 9.48982L18.2969 10.4704C18.703 10.9405 19.3032 11.2421 19.9736 11.2498L19.991 9.74995ZM19.432 9.48982C19.3181 9.35799 19.25 9.18789 19.25 9H17.75C17.75 9.56143 17.9566 10.0765 18.2969 10.4704L19.432 9.48982ZM17.9998 11.7765C18.6773 11.1017 19.0262 10.7616 19.2584 10.6183L18.4705 9.34191C18.0506 9.60109 17.547 10.1103 16.9412 10.7138L17.9998 11.7765ZM4.75 9C4.75 9.18789 4.68188 9.35799 4.56799 9.48982L5.70307 10.4704C6.0434 10.0765 6.25 9.56143 6.25 9H4.75ZM7.05879 10.7138C6.45296 10.1103 5.94936 9.60109 5.52946 9.34191L4.7416 10.6183C4.97377 10.7616 5.32273 11.1017 6.0002 11.7765L7.05879 10.7138ZM4.56799 9.48982C4.4311 9.64827 4.23192 9.74737 4.00904 9.74995L4.02639 11.2498C4.69676 11.2421 5.29701 10.9405 5.70307 10.4704L4.56799 9.48982ZM4.00904 9.74995C4.00602 9.74998 4.00301 9.75 4 9.75V11.25C4.00881 11.25 4.01761 11.2499 4.02639 11.2498L4.00904 9.74995ZM4.87514 12.3082C4.82571 11.8486 4.78687 11.4865 4.76601 11.192C4.74467 10.8908 4.74636 10.7093 4.76107 10.5995L3.27435 10.4003C3.23837 10.6689 3.24701 10.9769 3.26976 11.298C3.29298 11.6258 3.33535 12.0187 3.38375 12.4686L4.87514 12.3082ZM13.25 5C13.25 5.48504 12.9739 5.90689 12.5668 6.11457L13.2485 7.45073C14.1381 6.99685 14.75 6.07053 14.75 5H13.25ZM12.5668 6.11457C12.3975 6.20095 12.2056 6.25 12 6.25V7.75C12.448 7.75 12.873 7.6423 13.2485 7.45073L12.5668 6.11457ZM14.1055 7.36008C13.8992 6.9902 13.7138 6.65746 13.5437 6.3852L12.2716 7.1801C12.4176 7.41372 12.5828 7.70948 12.7954 8.09071L14.1055 7.36008ZM12 6.25C11.7944 6.25 11.6025 6.20095 11.4332 6.11457L10.7515 7.45073C11.127 7.6423 11.552 7.75 12 7.75V6.25ZM11.4332 6.11457C11.0261 5.90689 10.75 5.48504 10.75 5H9.25C9.25 6.07053 9.86186 6.99685 10.7515 7.45073L11.4332 6.11457ZM11.2046 8.09072C11.4172 7.70948 11.5824 7.41372 11.7284 7.1801L10.4563 6.3852C10.2862 6.65746 10.1008 6.9902 9.89453 7.36008L11.2046 8.09072Z"
                fill={mode === false ? "#e0e1dd" : "#414a5e"}
              />{" "}
              <path
                d="M5 17.5H19"
                stroke={mode === false ? "#e0e1dd" : "#414a5e"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />{" "}
            </g>
          </svg>
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
                  : `Player${Math.floor(Math.random() * 10000)}`}
              </h2>
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
            {user ? "" : <button onClick={()=> push("/auth")}>Register</button>}
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
                  .map((player, index) => (
                    <div className={styles.player} key={player.id}>
                      <div key={player.id} className={styles.playerItem}>
                        <div className={styles.leftSide}>
                          <div className={styles.username}>
                            {player.displayName.split(" ")[0]}{" "}
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
                      <hr className={styles.separator} />
                    </div>
                  ))
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
