import { ThemeToggle } from "../ui/ThemeToggle.jsx";
import styles from "./AppHeader.module.css";

export function AppHeader({ title, subtitle, children }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        {children}
        <span className={styles.mobileOnly}>
          <ThemeToggle />
        </span>
        <img className={styles.logo} src="/images/bookbox-logo.png" alt="BookBox" />
      </div>
    </header>
  );
}
