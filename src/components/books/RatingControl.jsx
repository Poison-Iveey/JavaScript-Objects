import clsx from "clsx";
import styles from "./RatingControl.module.css";

const SCALE = Array.from({ length: 10 }, (_, i) => i + 1);

export function RatingControl({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scale}>
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            className={clsx(styles.point, value != null && n <= value && styles.filled)}
            onClick={() => onChange(n)}
            aria-label={`Rate ${n} out of 10`}
          >
            {n}
          </button>
        ))}
      </div>
      {value != null && (
        <button type="button" className={styles.clear} onClick={() => onChange(null)}>
          Clear rating
        </button>
      )}
    </div>
  );
}
