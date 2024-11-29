import styles from "./utils.module.css";
const LoadingSkeleton = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSkeleton;
