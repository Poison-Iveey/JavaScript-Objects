import clsx from "clsx";
import { Icon } from "./Icon.jsx";
import { useTheme } from "../../hooks/useTheme.js";
import styles from "./controls.module.css";

export { styles as controlStyles };

export function UnderlineTabs({ items, value, onChange, large = false }) {
  return (
    <div className={clsx(styles.tabs, large && styles.tabsLarge)} role="tablist">
      {items.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={t.value === value}
          className={clsx(styles.tab, t.value === value && styles.tabOn)}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Segmented({ items, value, onChange, size, className, style }) {
  return (
    <div
      className={clsx(styles.segmented, size === "compact" && styles.segmentedCompact, size === "tiny" && styles.segmentedTiny, className)}
      style={style}
    >
      {items.map((t) => (
        <button
          key={t.value}
          type="button"
          aria-pressed={t.value === value}
          className={clsx(styles.segment, t.value === value && styles.segmentOn)}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ToggleRow({ label, on, onToggle }) {
  return (
    <button type="button" role="switch" aria-checked={on} className={styles.toggleRow} onClick={onToggle}>
      <span>{label}</span>
      <span className={clsx(styles.switch, on && styles.switchOn)} />
    </button>
  );
}

export function Stars({ rating, size }) {
  return (
    <span className={styles.stars} style={size ? { fontSize: size } : undefined} aria-label={`${rating} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? styles.starOn : undefined}>
          ★
        </span>
      ))}
    </span>
  );
}

// Tapping the current rating again lowers it by one (so 1 → unrated).
export function StarInput({ value, onChange }) {
  return (
    <div className={styles.starInput}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={styles.starButton}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(value === n ? n - 1 : n)}
        >
          <span className={n <= value ? styles.starOn : undefined}>★</span>
        </button>
      ))}
    </div>
  );
}

export function Button({ variant = "primary", danger, className, children, ...props }) {
  const cls = { primary: styles.primary, outline: styles.outline, text: styles.textButton, chip: styles.chip }[variant];
  return (
    <button type="button" className={clsx(cls, danger && styles.danger, className)} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, children, style }) {
  return (
    <label className={styles.label} style={style}>
      {label}
      {children}
    </label>
  );
}

export function ThemeButton({ size = 40, iconSize = 18, style }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      title="Toggle theme"
      aria-label="Toggle theme"
      className={styles.round}
      style={{ width: size, height: size, ...style }}
      onClick={toggleTheme}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={iconSize} stroke="currentColor" strokeWidth={1.7} />
    </button>
  );
}

export function Avatar({ src, name, size = 40, fontSize = 14, className, style }) {
  const letters = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        flex: "none",
        borderRadius: "50%",
        overflow: "hidden",
        background: "var(--nav-active)",
        color: "var(--title)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        font: `600 ${fontSize}px var(--font-body)`,
        ...style,
      }}
    >
      {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : letters}
    </span>
  );
}
