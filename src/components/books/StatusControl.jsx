import clsx from "clsx";
import styles from "./StatusControl.module.css";

const OPTIONS = [
  { value: "want", label: "Want to Read" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
];

export function StatusControl({ value, onChange }) {
  return (
    <div className={styles.control}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={clsx(styles.option, value === option.value && styles.active)}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
