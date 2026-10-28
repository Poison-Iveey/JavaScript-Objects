import clsx from "clsx";
import { Icon } from "./Icon.jsx";
import styles from "./Card.module.css";

export function Card({ variant, roomy = false, className, style, children, ...props }) {
  return (
    <section
      className={clsx(styles.card, roomy && styles.roomy, variant === "quote" && styles.quote, className)}
      style={style}
      {...props}
    >
      {children}
    </section>
  );
}

// The section heading bar: icon, uppercase title and an optional right-hand
// note or link. `icon="quote"` renders the large "66" mark instead of a glyph.
export function CardHeader({ icon, title, aside, onAside }) {
  return (
    <div className={styles.header}>
      {icon === "quote" ? <span className={styles.quoteMark}>66</span> : icon && <Icon name={icon} />}
      <span className={styles.title}>{title}</span>
      {aside &&
        (onAside ? (
          <button type="button" className={styles.asideButton} onClick={onAside}>
            {aside}
          </button>
        ) : (
          <span className={styles.aside}>{aside}</span>
        ))}
    </div>
  );
}
