import React, { ChangeEvent } from "react";
import styles from "../../footer.module.css";

interface CommentInputProps {
  newComment: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddComment: () => void;
}

const prohibitedWords = [
  "nigger",
  "nigga",
  "coon", // Add other slurs or offensive terms here
  "nicker",
  "ni gg er",
  "nig ger",
  "ni g ge r",
  "n i g g e r",
];

const containsProhibitedWords = (text: string) => {
  const regex = new RegExp(`\\b(${prohibitedWords.join("|")})\\b`, "gi");
  if (regex.test(text)) {
    alert("Your comment contains prohibited words and cannot be added.");
    return true;
  }
  return false;
};


const CommentInput: React.FC<CommentInputProps> = ({
  newComment,
  onChange,
  onAddComment,
}) => {
  const handleAddComment = () => {
    if (containsProhibitedWords(newComment)) {
      return;
    }
    onAddComment();
  };

  return (
    <div className={styles.commentInputContainer}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={newComment}
        onChange={onChange}
        className={styles.commentInput}
      />
      <button onClick={handleAddComment} className={styles.addCommentButton}>
        Add
      </button>
    </div>
  );
};

export default CommentInput;
