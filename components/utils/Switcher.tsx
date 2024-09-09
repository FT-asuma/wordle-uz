import { Dispatch, SetStateAction, useState } from "react";
import styles from "./utils.module.css";
const Switcher = ({
  setter,
  value,
}: {
  setter: Dispatch<SetStateAction<boolean>>;
  value: boolean;
}) => {
  const handleToggle = () => {
    setter(!value);
  };
  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={value} onChange={handleToggle} />
      <span className={styles.slider}></span>
    </label>
  );
};

export default Switcher;
