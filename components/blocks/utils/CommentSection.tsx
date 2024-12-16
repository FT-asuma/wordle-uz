import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import styles from "../footer.module.css";
import CommentInput from "./subs/CommentInput";
import CommentItem from "./subs/CommentItem";
import LoadMoreButton from "./subs/LoadMoreButton";

interface CommentSectionProps {
  user: any;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ user }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const [userImages, setUserImages] = useState<{ [userId: string]: string }>(
    {}
  );
  const [commentLimit, setCommentLimit] = useState<number>(10);
  const { isCommentSectionVisible, setIsCommentSectionVisible } =
    useAppContext();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "comments"), (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetchedComments.sort(
        (a, b) =>
          // @ts-ignore
          b.likes - b.dislikes - (a.likes - a.dislikes)
      );

      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserImage = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserImages((prev) => ({
            ...prev,
            [user.uid]: userData.photoURL || "default-image-url",
          }));
        }
      };

      fetchUserImage();
    }
  }, [user]);

  const handleAddComment = async () => {
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }
    if (newComment.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      await addDoc(collection(db, "comments"), {
        userId: user.uid,
        userName: user.displayName,
        userImage: userImages[user.uid] || "default-image-url",
        comment: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
      });
      setNewComment("");
      setIsCommentSectionVisible(false);
    } catch (error) {
      // @ts-ignore
      alert("Failed to add comment: " + error.message);
    }
  };

  const loadMoreComments = () => {
    setCommentLimit((prevLimit) => prevLimit + 10);
  };

  const handleUpdateComment = async (updatedComment: any) => {
    try {
      const commentRef = doc(db, "comments", updatedComment.id);
      await updateDoc(commentRef, {
        likes: updatedComment.likes,
        dislikes: updatedComment.dislikes,
        reactions: updatedComment.reactions,
      });

      setComments((prevComments) => {
        const updatedComments = prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        );

        return updatedComments.sort(
          (a, b) => b.likes - b.dislikes - (a.likes - a.dislikes)
        );
      });
    } catch (error: any) {
      alert("Failed to update comment: " + error.message);
    }
  };

  return (
    <motion.div
      className={styles.commentSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isCommentSectionVisible === true && (
        <CommentInput
          newComment={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onAddComment={handleAddComment}
        />
      )}

      <ul className={styles.commentList}>
        {comments.slice(0, commentLimit).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onUpdate={handleUpdateComment}
          />
        ))}
      </ul>

      {commentLimit < comments.length && (
        <LoadMoreButton onLoadMore={loadMoreComments} />
      )}
    </motion.div>
  );
};
