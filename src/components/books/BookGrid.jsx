import { AnimatePresence } from "framer-motion";
import { BookCard } from "./BookCard.jsx";
import styles from "./BookGrid.module.css";

export function BookGrid({ books, emptyMessage = "Your shelf is empty. Add the first book you've read." }) {
  if (books.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      <AnimatePresence>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </AnimatePresence>
    </div>
  );
}
