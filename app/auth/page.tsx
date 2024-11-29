"use client";

import React, { useState } from "react";
import styles from "./auth.module.css";
import { FaGoogle } from "react-icons/fa"; // Import Google icon from react-icons
import { auth, db, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthPage: React.FC = () => {
  const { push } = useRouter();

  // Google Login Function
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          wins: 0, // Initialize 'wins' field
        });
      }

      push("/"); // Navigate to home page or dashboard
    } catch (error: any) {
      alert(error.message); // Display a user-friendly message
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <div className={styles.header}>Sign in with Google</div>
        <button onClick={handleGoogleLogin} className={styles.googleButton}>
          <FaGoogle className={styles.googleIcon} /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
