import styles from "./FallingLeaves.module.css";

const LEAF_COLORS = ["var(--scene-leaf-1)", "var(--scene-leaf-2)", "var(--scene-leaf-3)"];

function buildLeaves(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 12 + Math.random() * 10,
    duration: 11 + Math.random() * 9,
    delay: Math.random() * -20,
    drift: (Math.random() - 0.5) * 70,
    color: LEAF_COLORS[i % LEAF_COLORS.length],
  }));
}

export function FallingLeaves({ count = 14, opacity = 0.85 }) {
  const leaves = buildLeaves(count);

  return (
    <div className={styles.layer} aria-hidden="true">
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className={styles.leaf}
          style={{
            left: `${leaf.left}%`,
            width: leaf.size,
            height: leaf.size,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            "--drift": `${leaf.drift}px`,
            "--leaf-opacity": opacity,
          }}
        >
          <svg viewBox="0 0 24 24">
            <path
              fill={leaf.color}
              d="M12 2c5 3 8 8 6 14-1.5 4.5-4.5 6.5-6 8-1.5-1.5-4.5-3.5-6-8-2-6 1-11 6-14z"
            />
            <path d="M12 4v18" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" fill="none" />
          </svg>
        </span>
      ))}
    </div>
  );
}
