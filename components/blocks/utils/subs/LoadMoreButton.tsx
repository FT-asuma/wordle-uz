import React from "react";
import styles from "../../footer.module.css";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onLoadMore }) => {
  return (
    <button onClick={onLoadMore} className={styles.loadMoreButton}>
      Load more
    </button>
  );
};

export default LoadMoreButton;
