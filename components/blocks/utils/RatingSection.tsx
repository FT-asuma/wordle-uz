import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "../footer.module.css";
import { db } from "@/app/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

interface RatingSectionProps {
  averageRating: number;
  user: any;
}

export const RatingSection: React.FC<RatingSectionProps> = ({
  averageRating,
  user,
}) => {
  const getStarColor = (starIndex: number) => {
    if (starIndex <= averageRating) return "yellow";
    return "gray";
  };

  const handleRate = async (star: number) => {
    if (!user) {
      alert("You must be logged in to rate.");
      return;
    }

    try {
      const userRatingDocRef = doc(db, "ratings", user.uid);
      const userRatingDoc = await getDoc(userRatingDocRef);

      if (userRatingDoc.exists()) {
        alert("You have already rated. Thank you!");
        return;
      }

      await setDoc(userRatingDocRef, {
        userId: user.uid,
        userName: user.displayName,
        rating: star,
        timestamp: new Date().toISOString(),
      });

      alert(`Thank you for rating ${star} star${star > 1 ? "s" : ""}!`);
    } catch (error) {
      // @ts-ignore
      alert("Failed to submit rating: " + error.message);
    }
  };

  return (
    <motion.div
      className={styles.ratingContainer}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <div className={styles.averageRate}>
        <span className={styles.ratingText}>Rate Us (Avg: </span>
        <span className={styles.averageRating}>{averageRating}</span>
        <span className={styles.ratingText}>):</span>
      </div>
      <div className={styles.rate}>
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.span
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaStar
              className={`${styles.star} ${
                getStarColor(star) === "yellow"
                  ? styles.activeStar
                  : styles.inactiveStar
              }`}
              onClick={() => handleRate(star)}
              color={getStarColor(star) === "yellow" ? "yellow" : "gray"}
            />
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
