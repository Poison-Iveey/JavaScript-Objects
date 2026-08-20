import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { AuthForm } from "../components/auth/AuthForm.jsx";
import { GoogleIcon } from "../components/ui/GoogleIcon.jsx";
import { ParkScene } from "../components/decor/ParkScene.jsx";
import { useAuth } from "../hooks/useAuth.js";
import styles from "./AuthPage.module.css";

export function AuthPage() {
  const { user, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState("login");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (user) return <Navigate to="/library" replace />;

  async function handleGoogleClick() {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <ParkScene leafCount={10} />
      <img className={styles.cornerLogo} src="/images/bookbox-logo.png" alt="BookBox" />
      <div className={styles.card}>
        <div className={styles.brand}>
          <BookMarked size={28} strokeWidth={1.5} />
          <h1 className={styles.title}>BookBox</h1>
        </div>

        <div className={styles.tabs}>
          <button
            className={mode === "login" ? styles.tabActive : styles.tab}
            onClick={() => setMode("login")}
            type="button"
          >
            Log In
          </button>
          <button
            className={mode === "signup" ? styles.tabActive : styles.tab}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <button className={styles.googleButton} type="button" onClick={handleGoogleClick} disabled={isGoogleLoading}>
          <GoogleIcon />
          {isGoogleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <div className={styles.divider}>
          <span>or continue with email</span>
        </div>

        <div className={styles.formArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <AuthForm mode={mode} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
