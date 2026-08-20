import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { FormField, Input } from "../ui/FormField.jsx";
import { IconButton } from "../ui/IconButton.jsx";
import { ConfirmDialog } from "../ui/ConfirmDialog.jsx";
import { UploadDropzone } from "./UploadDropzone.jsx";
import { FileAttachInput } from "./FileAttachInput.jsx";
import { StatusControl } from "./StatusControl.jsx";
import { RatingControl } from "./RatingControl.jsx";
import { GENRES } from "../../data/genres.js";
import { useBooks } from "../../hooks/useBooks.js";
import styles from "./BookDetailSheet.module.css";

export function BookDetailSheet({ book, isOpen, onClose }) {
  const { updateBook, setStatus, toggleFavorite, removeBook, attachFile, removeFileAttachment, updateCoverImage } =
    useBooks();
  const [notes, setNotes] = useState(book.notes ?? "");
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  const genreOptions = book.genre && !GENRES.includes(book.genre) ? [book.genre, ...GENRES] : GENRES;

  function field(key) {
    return {
      defaultValue: book[key],
      onBlur: (event) => {
        const value = key === "pages" ? Number(event.target.value) || 0 : event.target.value;
        if (value !== book[key]) updateBook(book.id, { [key]: value });
      },
    };
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book.title}>
      <div className={styles.body}>
        <div className={styles.coverRow}>
          <UploadDropzone onFileAccepted={(file) => updateCoverImage(book.id, file)} previewUrl={book.coverUrl} />
        </div>

        <FormField label="Title" id={`detail-title-${book.id}`}>
          <Input id={`detail-title-${book.id}`} key={book.title} {...field("title")} />
        </FormField>

        <FormField label="Author" id={`detail-author-${book.id}`}>
          <Input id={`detail-author-${book.id}`} key={book.author} {...field("author")} />
        </FormField>

        <FormField label="Pages" id={`detail-pages-${book.id}`}>
          <Input id={`detail-pages-${book.id}`} type="number" min="1" key={book.pages} {...field("pages")} />
        </FormField>

        <FormField label="Status" id={`detail-status-${book.id}`}>
          <StatusControl value={book.status} onChange={(status) => setStatus(book.id, status)} />
        </FormField>

        <div className={styles.favoriteRow}>
          <span className={styles.favoriteLabel}>Favorite</span>
          <IconButton
            icon={Heart}
            iconProps={{ fill: book.isFavorite ? "currentColor" : "none" }}
            label={book.status === "read" ? "Toggle favorite" : "Mark as read to favorite"}
            variant={book.isFavorite ? "accent" : "default"}
            disabled={book.status !== "read"}
            onClick={() => toggleFavorite(book.id)}
          />
        </div>

        <FormField label="Genre" id={`detail-genre-${book.id}`}>
          <select
            id={`detail-genre-${book.id}`}
            className={styles.select}
            value={book.genre ?? ""}
            onChange={(event) => updateBook(book.id, { genre: event.target.value || null })}
          >
            <option value="">No genre</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Your rating" id={`detail-rating-${book.id}`}>
          <RatingControl value={book.rating} onChange={(rating) => updateBook(book.id, { rating })} />
        </FormField>

        <FormField label="Notes" id={`detail-notes-${book.id}`}>
          <textarea
            id={`detail-notes-${book.id}`}
            className={styles.notes}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            onBlur={() => {
              if (notes !== book.notes) updateBook(book.id, { notes });
            }}
            rows={4}
            placeholder="Thoughts, quotes, anything worth remembering…"
          />
        </FormField>

        <FileAttachInput
          file={book.fileAttachment}
          onFileSelected={(file) => attachFile(book.id, file)}
          onClear={() => removeFileAttachment(book.id)}
        />

        <button type="button" className={styles.removeButton} onClick={() => setIsConfirmingRemove(true)}>
          <Trash2 size={16} strokeWidth={1.75} />
          Remove book
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmingRemove}
        onClose={() => setIsConfirmingRemove(false)}
        onConfirm={() => {
          removeBook(book.id);
          onClose();
        }}
        title="Remove this book?"
        message={`"${book.title}" will be removed from your library.`}
        confirmLabel="Remove"
      />
    </Modal>
  );
}
