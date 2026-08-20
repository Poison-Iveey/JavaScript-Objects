import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, BookOpen, BookOpenCheck, Heart, ImagePlus, Paperclip, Trash2 } from "lucide-react";
import { IconButton } from "../ui/IconButton.jsx";
import { ConfirmDialog } from "../ui/ConfirmDialog.jsx";
import { BookDetailSheet } from "./BookDetailSheet.jsx";
import { useBooks } from "../../hooks/useBooks.js";
import { formatPages } from "../../utils/formatters.js";
import { isImageFile } from "../../utils/validators.js";
import styles from "./BookCard.module.css";

const STATUS_CYCLE = { want: "reading", reading: "read", read: "want" };
const STATUS_META = {
  want: { icon: BookOpen, label: "Start reading", variant: "default" },
  reading: { icon: BookMarked, label: "Mark as read", variant: "accent" },
  read: { icon: BookOpenCheck, label: "Move back to Want to Read", variant: "accent" },
};

export function BookCard({ book }) {
  const { setStatus, toggleFavorite, removeBook, updateCoverImage } = useBooks();
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const coverInputRef = useRef(null);

  function handleCoverChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !isImageFile(file)) return;
    updateCoverImage(book.id, file);
  }

  const statusMeta = STATUS_META[book.status];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={styles.card}
    >
      <button type="button" className={styles.openDetail} onClick={() => setIsDetailOpen(true)}>
        <div className={styles.cover}>
          {book.coverUrl ? (
            <img src={book.coverUrl} alt="" />
          ) : (
            <span className={styles.placeholder}>{book.title[0]}</span>
          )}
          {book.fileAttachment && (
            <span className={styles.attachmentBadge} title={book.fileAttachment.name}>
              <Paperclip size={12} strokeWidth={2} />
            </span>
          )}
        </div>

        <div className={styles.info}>
          {book.status === "reading" && <span className={styles.readingBadge}>Reading</span>}
          <p className={styles.title}>{book.title}</p>
          <p className={styles.author}>{book.author}</p>
          <div className={styles.metaRow}>
            {book.genre && <span className={styles.genrePill}>{book.genre}</span>}
            {book.rating != null && <span className={styles.rating}>★ {book.rating}</span>}
          </div>
          <p className={styles.pages}>{formatPages(book.pages)}</p>
        </div>
      </button>

      <div className={styles.actions}>
        <div className={styles.actionsGroup}>
          <IconButton icon={ImagePlus} label="Change cover image" onClick={() => coverInputRef.current?.click()} />
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleCoverChange}
          />
          <IconButton
            icon={statusMeta.icon}
            label={statusMeta.label}
            variant={statusMeta.variant}
            onClick={() => setStatus(book.id, STATUS_CYCLE[book.status])}
          />
          <IconButton
            icon={Heart}
            iconProps={{ fill: book.isFavorite ? "currentColor" : "none" }}
            label={book.status === "read" ? "Toggle favorite" : "Mark as read to favorite"}
            variant={book.isFavorite ? "accent" : "default"}
            disabled={book.status !== "read"}
            onClick={() => toggleFavorite(book.id)}
          />
        </div>
        <IconButton icon={Trash2} label="Remove book" variant="danger" onClick={() => setIsConfirmingRemove(true)} />
      </div>

      <ConfirmDialog
        isOpen={isConfirmingRemove}
        onClose={() => setIsConfirmingRemove(false)}
        onConfirm={() => removeBook(book.id)}
        title="Remove this book?"
        message={`"${book.title}" will be removed from your library.`}
        confirmLabel="Remove"
      />

      {isDetailOpen && <BookDetailSheet book={book} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />}
    </motion.article>
  );
}
