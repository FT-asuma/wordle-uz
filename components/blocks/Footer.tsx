"use client";

import { useState, useEffect, Suspense } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "@/app/firebase"; // Firebase configuration
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAppContext } from "@/context/AppContext";
import { RatingSection } from "./utils/RatingSection";
import { CommentSection } from "./utils/CommentSection";
import { SocialLinks } from "./utils/SocialLinks";
import { FooterNote } from "./utils/FooterNote";
import { motion } from "framer-motion";
import styles from "./footer.module.css";
import Loading from "@/app/loading";

const Footer: React.FC = () => {
  const { isCommentSectionVisible, setIsCommentSectionVisible } =
    useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  // Fetch user authentication state
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // Fetch comments and ratings from Firebase
  useEffect(() => {
    const unsubscribeComments = onSnapshot(
      collection(db, "comments"),
      (snapshot) => {
        // Handle comment data
      }
    );

    const unsubscribeRatings = onSnapshot(
      collection(db, "ratings"),
      (snapshot) => {
        const ratings = snapshot.docs.map((doc) => doc.data().rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0;
        setAverageRating(Number(avgRating.toFixed(1)));
      }
    );

    return () => {
      unsubscribeComments();
      unsubscribeRatings();
    };
  }, []);

  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className={styles.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Thanks for playing my Wordle-inspired game! Connect with me, rate the
          game, or leave a comment below. Your feedback and support help improve
          the experience for everyone!
        </motion.p>

        <Suspense fallback={<Loading />}>
          <RatingSection averageRating={averageRating} user={user} />
        </Suspense>
        <h3 style={{ marginBottom: 8, marginTop: 16 }}>Comments</h3>

        <motion.button
          className={styles.toggleCommentButton}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsCommentSectionVisible(!isCommentSectionVisible)}
        >
          {!isCommentSectionVisible ? "Add comment" : "Close"}
        </motion.button>

        <CommentSection user={user} />

        <SocialLinks />

        <FooterNote />
      </motion.div>
    </footer>
  );
};

export default Footer;
