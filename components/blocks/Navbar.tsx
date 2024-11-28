"use client";
import React, { Dispatch } from "react";
import styles from "./blocks.module.css";
import Wrapper from "../container/Wrapper";
import { ImBooks } from "react-icons/im";
import Link from "next/link";
import Switcher from "../utils/Switcher";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

const Navbar = ({
  mode,
  setMode,
}: {
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className={styles.navbar}>
      <div className={styles.wrapperTabs}>
        <button
          className={styles.tabs}
          style={mode === true ? { backgroundColor: "#ebedf3" } : {}}
        >
          <ImBooks
            color={mode === false ? "#e0e1dd" : "rgb(65, 74, 94)"}
            height={24}
            width={24}
          />
        </button>
        <Link href={"/"} style={mode === true? {background: "#ebedf3"}: {}} className={styles.tabs}>Back to Game</Link>
      </div>
      <div className={styles.wrapperTabs}>
        <h2>Dictionary</h2>
      </div>
      <div
        style={{ width: 190, justifyContent: "flex-end" }}
        className={styles.wrapperTabs}
      >
        <button
          className={styles.tabs}
          onClick={() => {
            setMode(!mode);
          }}
          style={
            mode === true
              ? { backgroundColor: "#ebedf3", transition: "0.3s all ease" }
              : { transition: "0.3s all ease" }
          }
        >
          {mode === false ? (
            <IoMoonOutline width={24} height={24} />
          ) : (
            <IoSunnyOutline color="rgb(65, 74, 94)" width={24} height={24} />
          )}
        </button>
        <Switcher setter={setMode} value={mode} />
      </div>
    </div>
  );
};

export default Navbar;
