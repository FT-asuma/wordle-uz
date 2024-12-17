import React, { useState, useEffect } from "react";
import styles from "../../footer.module.css";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";

interface CommentItemProps {
  comment: any;
  onUpdate: (updatedComment: any) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate }) => {
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null
  );

  useEffect(() => {
    setUserReaction(comment.userReaction || null);
  }, []);

  const truncateUserName = (name: string, maxLength: number) =>
    name.length > maxLength ? name.slice(0, maxLength) + "..." : name;

  const handleLike = () => {
    if (userReaction === "like") return;

    const updatedReactions = {
      ...comment.reactions,
      [comment.userId]: "like",
    };

    const updatedComment = {
      ...comment,
      likes: comment.likes + (userReaction === "dislike" ? 2 : 1),
      dislikes: comment.dislikes - (userReaction === "dislike" ? 1 : 0),
      reactions: updatedReactions,
      userReaction: "like",
    };

    setUserReaction("like");
    if (updatedComment.likes - updatedComment.dislikes === -10) {
      onUpdate(null); // Delete the comment
    } else {
      onUpdate(updatedComment);
    }
  };

  const handleDislike = () => {
    if (userReaction === "dislike") return;

    const updatedReactions = {
      ...comment.reactions,
      [comment.userId]: "dislike",
    };

    const updatedComment = {
      ...comment,
      dislikes: comment.dislikes + (userReaction === "like" ? 2 : 1),
      likes: comment.likes - (userReaction === "like" ? 1 : 0),
      reactions: updatedReactions,
      userReaction: "dislike",
    };

    setUserReaction("dislike");
    if (updatedComment.likes - updatedComment.dislikes === -10) {
      onUpdate(null); // Delete the comment
    } else {
      onUpdate(updatedComment);
    }
  };

  const netLikes = comment.likes - comment.dislikes;
  return (
    <li className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <div className={styles.userImageContainer}>
          <img
            src={comment.userImage || "/default-user.png"}
            alt={comment.userName}
            className={styles.userImage}
          />
        </div>
        <div className={styles.userNameDate}>
          <h4>{truncateUserName(comment.userName, 25)}</h4>
        </div>
        <div className={styles.likeDislikeContainerTopRight}>
          <button onClick={handleLike} disabled={userReaction !== null}>
            {userReaction === "like" ? (
              <AiFillLike size={24} />
            ) : (
              <AiOutlineLike size={24} />
            )}
          </button>
          <span className={styles.netLikes}>{netLikes}</span>
          <button onClick={handleDislike} disabled={userReaction !== null}>
            {userReaction === "dislike" ? (
              <AiFillDislike size={24} />
            ) : (
              <AiOutlineDislike size={24} />
            )}
          </button>
        </div>
      </div>
      <div className={styles.commentDate}>
        <span>
          Posted on {new Date(comment.timestamp).toLocaleDateString()}
        </span>
      </div>
      <div className={styles.commentText}>
        <p>{comment.comment}</p>
      </div>
    </li>
  );
};

export default CommentItem;
