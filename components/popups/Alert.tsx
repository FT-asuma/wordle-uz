import React from "react";
import styles from "./popups.module.css";
const Alert = ({ value, type }: { value: string; type: string }) => {
  return (
    <div
      style={
        value === ""
          ? { opacity: 0, zIndex: -1, transition: "0.5s" }
          : { transition: "0.5s", opacity: 1, zIndex: 10 }
      }
      className={styles.popup}
    >
      <div className={styles.container}>
        <h3>{value}</h3>
        <p>{value && "Please try another word"}</p>
      </div>
    </div>
  );
};

export default Alert;
