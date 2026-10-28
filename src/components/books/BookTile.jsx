import { Stars } from "../ui/controls.jsx";
import { Icon } from "../ui/Icon.jsx";
import { STATUSES } from "../../data/community.js";
import styles from "./BookTile.module.css";

export { styles as tileStyles };

// Cover, title, author, stars and (while reading) a progress bar.
export function BookTile({ book, onOpen, showStatus = false }) {
  const statusLabel = STATUSES.find((s) => s.value === book.status)?.label;
  return (
    <button type="button" className={styles.tile} onClick={() => onOpen(book.id)}>
      <div className={styles.cover}>
        <img src={book.cover} alt="" />
        {showStatus && <span className={styles.status}>{statusLabel}</span>}
      </div>
      <div className={styles.title}>{book.title}</div>
      <div className={styles.author}>{book.author}</div>
      <div className={styles.stars}>
        <Stars rating={book.rating} />
      </div>
      {book.status === "reading" && (
        <div className={styles.progress}>
          <progress value={book.read} max={book.pages || 1} />
          <span>{book.pct}%</span>
        </div>
      )}
    </button>
  );
}

export function DropTile({ onClick }) {
  return (
    <button type="button" className={styles.dropTile} onClick={onClick}>
      <Icon name="plus" size={26} strokeWidth={1.6} />
      Drop or choose a cover
    </button>
  );
}

export function MiniBook({ cover, title, onOpen }) {
  return (
    <button type="button" className={styles.mini} onClick={onOpen}>
      <img src={cover} alt="" />
      <span>{title}</span>
    </button>
  );
}
