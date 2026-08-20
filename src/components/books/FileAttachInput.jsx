import { useRef, useState } from "react";
import { FileText, Paperclip, X } from "lucide-react";
import { isEbookFile } from "../../utils/validators.js";
import { formatFileSize } from "../../utils/formatters.js";
import styles from "./FileAttachInput.module.css";

export function FileAttachInput({ file, onFileSelected, onClear }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!isEbookFile(selected)) {
      setError("Please choose a PDF or EPUB file.");
      return;
    }
    setError(null);
    onFileSelected(selected);
  }

  if (file) {
    return (
      <div className={styles.attached}>
        <FileText size={18} strokeWidth={1.75} />
        <div className={styles.meta}>
          <span className={styles.name}>{file.name}</span>
          <span className={styles.size}>{formatFileSize(file.size)}</span>
        </div>
        <button type="button" className={styles.clear} onClick={onClear} aria-label="Remove attached file">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button type="button" className={styles.picker} onClick={() => inputRef.current?.click()}>
        <Paperclip size={18} strokeWidth={1.75} />
        <span>Attach a PDF or EPUB (optional)</span>
        <input ref={inputRef} type="file" accept=".pdf,.epub" className={styles.hiddenInput} onChange={handleChange} />
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
