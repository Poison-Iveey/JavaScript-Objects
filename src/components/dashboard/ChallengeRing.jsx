import clsx from "clsx";
import { useJournal } from "../../hooks/useJournal.js";
import styles from "./widgets.module.css";

// Progress ring for one challenge. Auto challenges ("Books this year")
// count finished books; manual ones have − / + steppers.
export function ChallengeRing({ challenge, index, readCount, large = false }) {
  const { bumpChallenge, removeChallenge } = useJournal();
  const count = challenge.auto ? challenge.count + readCount : challenge.count;
  const pct = Math.min(100, Math.round((count / challenge.goal) * 100));
  const size = large ? 120 : 100;
  const color = index % 2 ? "var(--ring2)" : "var(--ring1)";

  return (
    <div className={clsx(styles.ring, large && styles.ringLarge)}>
      <button type="button" className={styles.ringRemove} title="Remove" aria-label="Remove challenge" onClick={() => removeChallenge(challenge.id)}>
        ×
      </button>
      <div className={styles.ringName}>{challenge.name}</div>
      <div className={styles.ringGraphic}>
        {!large && <span className={styles.ringSpark}>✦</span>}
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ring-track)" strokeWidth="9" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeDasharray={`${((2 * Math.PI * 40 * pct) / 100).toFixed(1)} 300`}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dasharray .6s" }}
          />
        </svg>
        <span className={styles.ringPct}>{pct}%</span>
      </div>
      <div className={styles.ringCount}>
        {!challenge.auto && (
          <button type="button" className={styles.step} aria-label="Decrease" onClick={() => bumpChallenge(challenge.id, -1)}>
            −
          </button>
        )}
        <span>
          {count} of {challenge.goal}
          {challenge.auto ? " · counts finished books" : ""}
        </span>
        {!challenge.auto && (
          <button type="button" className={styles.step} aria-label="Increase" onClick={() => bumpChallenge(challenge.id, 1)}>
            +
          </button>
        )}
      </div>
    </div>
  );
}
