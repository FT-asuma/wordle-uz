"use client"
import React from "react";
import styles from "./blocks.module.css";
import Wrapper from "../container/Wrapper";
import { ImBooks } from "react-icons/im";
import Link from "next/link";
import Switcher from "../utils/Switcher";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.wrapperTabs}>
        <button className={styles.tabs}>
          <ImBooks color="#e0e1dd" height={24} width={24} />
        </button>
        <Link href={"/"}>Back to Home page</Link>
      </div>
      <div className={styles.wrapperTabs}>
        <h3>Word Definition</h3>
      </div>
      <div style={{width: 190, justifyContent: "flex-end"}} className={styles.wrapperTabs}>
        <Switcher setter={()=> {}} value />
      </div>
    </div>
  );
};

export default Navbar;
