import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { FormField, Input } from "../ui/FormField.jsx";
import { Button } from "../ui/Button.jsx";
import { UploadDropzone } from "./UploadDropzone.jsx";
import { FileAttachInput } from "./FileAttachInput.jsx";
import { StatusControl } from "./StatusControl.jsx";
import { GENRES } from "../../data/genres.js";
import { useBooks } from "../../hooks/useBooks.js";
import styles from "./AddBookSheet.module.css";

const initialFields = { title: "", author: "", pages: "", status: "want", genre: "" };

export function AddBookSheet({ isOpen, onClose, initialCoverFile = null }) {
  const { addBook } = useBooks();
  const [fields, setFields] = useState(initialFields);
  const [coverFile, setCoverFile] = useState(initialCoverFile);
  const [ebookFile, setEbookFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);

  useEffect(() => {
    if (isOpen && initialCoverFile) setCoverFile(initialCoverFile);
  }, [isOpen, initialCoverFile]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  function update(key) {
    return (event) => setFields((current) => ({ ...current, [key]: event.target.value }));
  }

  function reset() {
    setFields(initialFields);
    setCoverFile(null);
    setEbookFile(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!fields.title.trim() || !fields.author.trim()) return;

    setIsSubmitting(true);
    try {
      await addBook({
        title: fields.title.trim(),
        author: fields.author.trim(),
        pages: fields.pages,
        status: fields.status,
        genre: fields.genre || null,
        coverImageFile: coverFile,
        fileAttachment: ebookFile,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add a book">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.coverRow}>
          <UploadDropzone onFileAccepted={setCoverFile} previewUrl={coverPreviewUrl} />
        </div>

        <FormField label="Title" id="book-title">
          <Input id="book-title" value={fields.title} onChange={update("title")} required />
        </FormField>

        <FormField label="Author" id="book-author">
          <Input id="book-author" value={fields.author} onChange={update("author")} required />
        </FormField>

        <FormField label="Pages" id="book-pages">
          <Input id="book-pages" type="number" min="1" value={fields.pages} onChange={update("pages")} />
        </FormField>

        <FormField label="Genre" id="book-genre">
          <select id="book-genre" className={styles.select} value={fields.genre} onChange={update("genre")}>
            <option value="">No genre</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Status" id="book-status">
          <StatusControl value={fields.status} onChange={(status) => setFields((current) => ({ ...current, status }))} />
        </FormField>

        <FileAttachInput file={ebookFile} onFileSelected={setEbookFile} onClear={() => setEbookFile(null)} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding…" : "Add to shelf"}
        </Button>
      </form>
    </Modal>
  );
}
