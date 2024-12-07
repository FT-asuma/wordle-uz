// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "wordle-uz.firebaseapp.com",
  projectId: "wordle-uz",
  storageBucket: "wordle-uz.firebasestorage.app",
  messagingSenderId: "1071681568895",
  appId: "1:1071681568895:web:26099e2ff6399941fb3f4a",
  measurementId: "G-QZLNYT882C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app); // Export the auth object
export const googleProvider = new GoogleAuthProvider();
