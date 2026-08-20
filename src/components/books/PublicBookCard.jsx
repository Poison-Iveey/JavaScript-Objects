import { Heart } from "lucide-react";
import { formatPages } from "../../utils/formatters.js";
import styles from "./BookCard.module.css";

export function PublicBookCard({ book }) {
  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        {book.coverUrl ? <img src={book.coverUrl} alt="" /> : <span className={styles.placeholder}>{book.title[0]}</span>}
      </div>

      <div className={styles.info}>
        {book.status === "reading" && <span className={styles.readingBadge}>Reading</span>}
        <p className={styles.title}>{book.title}</p>
        <p className={styles.author}>{book.author}</p>
        <div className={styles.metaRow}>
          {book.genre && <span className={styles.genrePill}>{book.genre}</span>}
          {book.rating != null && <span className={styles.rating}>★ {book.rating}</span>}
          {book.isFavorite && <Heart size={14} strokeWidth={1.75} fill="currentColor" />}
        </div>
        <p className={styles.pages}>{formatPages(book.pages)}</p>
      </div>
    </article>
  );
}
