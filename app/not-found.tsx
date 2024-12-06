// app/not-found.tsx

import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import styles from "./page.module.css"
const NotFoundPage: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <Image
          src="/404.png" // Use your own image path here
          alt="404 Image"
          width={250}
          height={250}
          className={styles.image}
        />
        <Link href="/" className={styles.link}>Go back to homepage</Link>
      </div>
    </div>
  );
};
export default NotFoundPage;
