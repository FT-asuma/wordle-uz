import { FaDiscord, FaGithub, FaInstagram } from "react-icons/fa";
import styles from "../footer.module.css";
import { motion } from "framer-motion";
import Link from "next/link";

export const SocialLinks: React.FC = () => (
  <motion.div
    className={styles.socialLinks}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
  >
    <Link href="https://discord.com" target="_blank" rel="noopener noreferrer" className={styles.discord}>
      <FaDiscord size={24} />
    </Link>
    <Link href="https://github.com/FT-asuma" target="_blank" rel="noopener noreferrer" className={styles.github}>
      <FaGithub size={24} />
    </Link>
    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.instagram}>
      <FaInstagram size={24} />
    </Link>
  </motion.div>
);
