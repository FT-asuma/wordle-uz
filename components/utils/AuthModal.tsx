"use client"
import React, { useState } from "react";
import styles from "./auth.module.css";

const AuthModal = ({ show, onClose }: {
  show: boolean
  onClose: () => void
}) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!show) return null;

  const toggleAuthMode = () => {
    setIsLogin((prevMode) => !prevMode);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.auth}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.header}>{isLogin ? "Login" : "Register"}</div>
        <form>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className={styles.switchText} onClick={toggleAuthMode}>
          {isLogin
            ? "Don't have an account? Click to Register"
            : "Already have an account? Click to Login"}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
