import { useState } from "react";
import { FormField, Input } from "../ui/FormField.jsx";
import { Button } from "../ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { isValidEmail } from "../../utils/validators.js";
import styles from "./AuthForm.module.css";

export function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { signIn, signUp } = useAuth();
  const [fields, setFields] = useState({ displayName: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(key) {
    return (event) => setFields((current) => ({ ...current, [key]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(fields.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (fields.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        await signUp(fields);
      } else {
        await signIn(fields);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isSignup && (
        <FormField label="Display name" id="displayName">
          <Input
            id="displayName"
            type="text"
            placeholder="Yvette"
            value={fields.displayName}
            onChange={update("displayName")}
          />
        </FormField>
      )}
      <FormField label="Email" id="email">
        <Input id="email" type="email" placeholder="you@example.com" value={fields.email} onChange={update("email")} required />
      </FormField>
      <FormField label="Password" id="password">
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={fields.password}
          onChange={update("password")}
          required
        />
      </FormField>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Log in"}
      </Button>
    </form>
  );
}
