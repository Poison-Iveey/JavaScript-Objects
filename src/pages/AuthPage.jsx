import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Field, Segmented, ThemeButton, controlStyles } from "../components/ui/controls.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { isValidEmail } from "../utils/validators.js";
import styles from "./AuthPage.module.css";

const MODES = [
  { value: "signin", label: "Sign in" },
  { value: "signup", label: "Create account" },
];

export function AuthPage() {
  const { user, isLoading, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);

  if (!isLoading && user) return <Navigate to="/dashboard" replace />;

  const isSignup = mode === "signup";

  const submit = async () => {
    const email = emailRef.current?.value.trim() || "";
    const password = passRef.current?.value || "";
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    setBusy(true);
    try {
      if (isSignup) {
        const displayName = nameRef.current?.value.trim() || email.split("@")[0];
        await signUp({ displayName, email, password });
      } else {
        await signIn({ email, password });
      }
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => e.key === "Enter" && submit();

  return (
    <div className={styles.page}>
      <video className={styles.video} src="/media/header.mp4" autoPlay loop muted playsInline />
      <div className={styles.veil} />
      <ThemeButton size={42} iconSize={19} style={{ position: "absolute", top: 16, right: 16, zIndex: 2, background: "var(--panel)" }} />

      <div className={styles.card}>
        <div className={styles.crescent} aria-hidden="true">
          <span />
          <span>☾</span>
          <span />
        </div>
        <h1 className={styles.title}>Literary Journey</h1>
        <p className={styles.tagline}>Your personal library of every book you've read.</p>

        <Segmented
          items={MODES}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setError("");
          }}
          style={{ marginBottom: 18 }}
        />

        <div className={styles.form}>
          {isSignup && (
            <Field label="Name">
              <input ref={nameRef} className={controlStyles.input} placeholder="Ada Reader" autoComplete="name" />
            </Field>
          )}
          <Field label="Email">
            <input ref={emailRef} type="email" className={controlStyles.input} placeholder="you@example.com" autoComplete="email" onKeyDown={onKey} />
          </Field>
          <Field label="Password">
            <input
              ref={passRef}
              type="password"
              className={controlStyles.input}
              placeholder="At least 6 characters"
              autoComplete={isSignup ? "new-password" : "current-password"}
              onKeyDown={onKey}
            />
          </Field>
          {error && <div className={styles.error}>{error}</div>}
          <Button className={styles.cta} onClick={submit} disabled={busy}>
            {busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          </Button>
          <div className={styles.or}>
            <span />
            OR
            <span />
          </div>
          <button type="button" className={styles.google} onClick={() => signInWithGoogle().catch((e) => setError(e.message))}>
            Continue with Google
          </button>
          <p className={styles.note}>You'll stay signed in on this device.</p>
        </div>
      </div>
    </div>
  );
}
