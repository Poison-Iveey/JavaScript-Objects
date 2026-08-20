import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { ParkScene } from "../components/decor/ParkScene.jsx";
import { useAuth } from "../hooks/useAuth.js";
import styles from "./SplashPage.module.css";

const MIN_DISPLAY_MS = 1600;

export function SplashPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const start = Date.now();
    let cancelled = false;

    function proceed() {
      if (cancelled) return;
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        if (!cancelled) navigate(user ? "/library" : "/auth", { replace: true });
      }, remaining);
    }

    if (!isLoading) proceed();
    return () => {
      cancelled = true;
    };
  }, [isLoading, user, navigate]);

  return (
    <div className={styles.splash}>
      <ParkScene variant="dusk" leafCount={16} />
      <div className={styles.gradientBar} />
      <motion.div
        className={styles.mark}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <BookMarked size={56} strokeWidth={1.5} />
      </motion.div>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        BookBox
      </motion.h1>
      <motion.p
        className={styles.tagline}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        Your library, wherever you go.
      </motion.p>
    </div>
  );
}
