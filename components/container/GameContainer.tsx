"use client";
import React from "react";

import styles from "./container.module.css";
import classes from "@/app/page.module.css";

import { useAppContext } from "@/context/AppContext";

const GameContainer = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useAppContext();
  return (
    <main className={`${classes.main} ${mode ? classes.lightMode : ""}`}>
      <section className={styles.container} key={`${children}`}>
        {children}
      </section>
    </main>
  );
};

export default GameContainer;
