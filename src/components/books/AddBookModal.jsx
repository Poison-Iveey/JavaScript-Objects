import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Icon } from "../ui/Icon.jsx";
import { Button, Field, Segmented, controlStyles } from "../ui/controls.jsx";
import { useShell } from "../layout/ShellContext.jsx";
import { useLibrary } from "../../hooks/useLibrary.js";
import { STATUSES } from "../../data/community.js";
import styles from "./BookModals.module.css";

export function AddBookModal() {
  const { addOpen, closeAdd, draft, setDraft, pickImage, notify } = useShell();
  const { addBook } = useLibrary();
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (addOpen) setError(false);
  }, [addOpen]);

  if (!addOpen) return null;

  const set = (key) => (e) => {
    setDraft((d) => ({ ...d, [key]: e.target.value }));
    if (key === "title") setError(false);
  };

  const save = async () => {
    if (!draft.title.trim()) {
      setError(true);
      return;
    }
    setSaving(true);
    try {
      await addBook({
        title: draft.title.trim(),
        author: draft.author.trim() || "Unknown",
        pages: parseInt(draft.pages, 10) || 300,
        status: draft.status,
        coverFile: draft.file,
      });
      closeAdd();
    } catch (e) {
      notify(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Add a book" titleSize={14} onClose={closeAdd}>
      <div className={styles.addBody}>
        <button type="button" className={styles.addCover} onClick={() => pickImage("add")}>
          {draft.img && <img src={draft.img} alt="" />}
          <Icon name="upload" size={28} strokeWidth={1.4} />
          Drop cover image or click to browse
        </button>
        <div className={styles.addFields}>
          <Field label="Title">
            <input className={controlStyles.input} value={draft.title} onChange={set("title")} placeholder="Book title" />
          </Field>
          <Field label="Author">
            <input className={controlStyles.input} value={draft.author} onChange={set("author")} placeholder="Author" />
          </Field>
          <Field label="Total pages">
            <input className={controlStyles.input} type="number" value={draft.pages} onChange={set("pages")} placeholder="320" />
          </Field>
          <Segmented size="tiny" items={STATUSES} value={draft.status} onChange={(status) => setDraft((d) => ({ ...d, status }))} />
          {error && <div className={styles.error}>Add a title to save.</div>}
          <Button className={styles.save} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save to library"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
