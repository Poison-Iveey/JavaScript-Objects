import styles from "./FormField.module.css";

export function FormField({ label, error, id, children }) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

export function Input({ id, className, ...props }) {
  return <input id={id} className={styles.input} {...props} />;
}
