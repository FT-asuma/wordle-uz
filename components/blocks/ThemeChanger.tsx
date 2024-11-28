"use client";
import React, { ReactNode, useState } from "react";
import { useEffect } from "react";
import styles from "./blocks.module.css";
import Navbar from "./Navbar";
import Wrapper from "../container/Wrapper";
import SearchBar from "../utils/Searchbar";
const ThemeChanger = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState(false);
  const [isPending, setIsPending] = useState(true);
  useEffect(() => {
    setIsPending(true);
    const theme = localStorage.getItem("mode");
    if (theme) {
      setMode(JSON.parse(theme));
      setIsPending(false);
    } else {
      setMode(false);
      setIsPending(false);
    }
  }, []);
  useEffect(() => {
    if (mode === true) {
      localStorage.setItem("mode", String(mode));
      console.log("wefwef");
    } else {
      if (isPending === false && mode === false) {
        localStorage.setItem("mode", String(mode));
      }
    }
  }, [mode, isPending]);
  if (isPending === true) return;
  return (
    <div className={mode === true ? styles.light : styles.dark}>
      <Wrapper>
        <Navbar setMode={setMode} mode={mode} />
        <SearchBar mode={mode} />
        {children}
      </Wrapper>
    </div>
  );
};

export default ThemeChanger;
