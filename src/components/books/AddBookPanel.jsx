import { useState } from "react";
import { Plus } from "lucide-react";
import { UploadDropzone } from "./UploadDropzone.jsx";
import { AddBookSheet } from "./AddBookSheet.jsx";
import styles from "./AddBookPanel.module.css";

export function AddBookPanel() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pendingCoverFile, setPendingCoverFile] = useState(null);

  function openWithCover(file) {
    setPendingCoverFile(file);
    setIsSheetOpen(true);
  }

  function openManually() {
    setPendingCoverFile(null);
    setIsSheetOpen(true);
  }

  return (
    <section className={styles.panel}>
      <UploadDropzone shape="banner" label="Drag & drop a cover here, or tap to browse" onFileAccepted={openWithCover} />
      <button type="button" className={styles.manualLink} onClick={openManually}>
        <Plus size={16} strokeWidth={2} />
        Add a book manually
      </button>

      <AddBookSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} initialCoverFile={pendingCoverFile} />
    </section>
  );
}
