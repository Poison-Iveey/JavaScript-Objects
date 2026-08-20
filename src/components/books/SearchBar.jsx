import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

export function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <Search size={18} strokeWidth={1.75} className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        placeholder="Search by title, author, or genre…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
