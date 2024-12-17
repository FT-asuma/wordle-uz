import { motion } from "framer-motion";
import styles from "../footer.module.css";

export const FooterNote: React.FC = () => (
  <>
    <motion.p
      className={styles.footerNote}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      Built with ❤️ using Next.js, Firebase, and React Icons
    </motion.p>
    <motion.p
      className={styles.copyright}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      © FT-asuma projects, 2024. All rights reserved.
    </motion.p>
  </>
);
