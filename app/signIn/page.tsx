// pages/login.js
"use client";
import { useState } from "react";
import styles from "./sign-up.module.css";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { push } = useRouter();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleLogin = async (e: any) => {
    e.preventDefault()
    try {
      const res = await signInWithEmailAndPassword(username, password);
      console.log({ res });
      setPassword("");
      setUsername("");
      push("/")
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign Up</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}
