import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";

interface MotionProps {
  children: ReactNode;
}

const Motion: React.FC<MotionProps> = ({ children }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 0 }} // posisi awal sebelum muncul
          animate={{ opacity: 1, y: 0 }} // animasi saat muncul
          exit={{ opacity: 0, y: 10 }} // animasi saat hilang (kalau pakai AnimatePresence)
          transition={{ duration: 0.2, ease: "easeOut" }} // pengaturan transisi
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default Motion;
