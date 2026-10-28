import { useRef } from "react";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Button, controlStyles } from "../components/ui/controls.jsx";
import { useShell } from "../components/layout/ShellContext.jsx";
import { useLibrary } from "../hooks/useLibrary.js";
import styles from "./pages.module.css";

export function QuotesPage() {
  const { books, updateBook } = useLibrary();
  const { openDetail, notify } = useShell();
  const bookRef = useRef(null);
  const textRef = useRef(null);

  const addQuote = () => {
    const id = bookRef.current?.value;
    const t = textRef.current?.value.trim();
    const b = books.find((x) => x.id === id);
    if (!b || !t) return;
    updateBook(id, { quotes: [...b.quotes, t] }).catch((e) => notify(e.message));
    textRef.current.value = "";
  };

  const allQuotes = books
    .flatMap((b) =>
      b.quotes.map((t, i) => ({
        key: `${b.id}-${i}`,
        text: t,
        book: b.title,
        open: () => openDetail(b.id),
        remove: () => updateBook(b.id, { quotes: b.quotes.filter((_, j) => j !== i) }),
      }))
    )
    .reverse();
  const notes = books.filter((b) => b.notes.trim());

  return (
    <div className={styles.wrap}>
      <Card variant="quote" roomy style={{ flex: "1.5 1 360px" }}>
        <CardHeader icon="quote" title="Quotes" />
        <div className={styles.formRow} style={{ margin: "14px 0 16px" }}>
          <select ref={bookRef} className={controlStyles.input} style={{ flex: "0 1 190px", width: "auto" }} aria-label="Book">
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
          <input
            ref={textRef}
            placeholder="Type a quote you love"
            className={controlStyles.input}
            style={{ flex: "1 1 200px", width: "auto" }}
            onKeyDown={(e) => e.key === "Enter" && addQuote()}
          />
          <Button onClick={addQuote}>Save quote</Button>
        </div>
        <div className={styles.quoteGrid}>
          {allQuotes.map((q) => (
            <div key={q.key} className={styles.quoteCard}>
              <button type="button" className={styles.xCorner} title="Remove" aria-label="Remove quote" onClick={q.remove}>
                ×
              </button>
              <p>“{q.text}”</p>
              <button type="button" className={styles.linkMuted} onClick={q.open}>
                — {q.book}
              </button>
            </div>
          ))}
        </div>
        {!allQuotes.length && <p className={styles.muted}>No quotes yet.</p>}
      </Card>

      <Card roomy style={{ flex: "1 1 300px" }}>
        <CardHeader icon="pen" title="Notes" />
        <div className={styles.noteList}>
          {notes.map((b) => (
            <button key={b.id} type="button" className={styles.note} onClick={() => openDetail(b.id)}>
              <img src={b.cover} alt="" />
              <span className={styles.noteText}>
                <span>{b.title}</span>
                <span>{b.notes}</span>
              </span>
            </button>
          ))}
          {!notes.length && <p className={styles.mutedSmall}>Notes you write on a book's page appear here.</p>}
        </div>
      </Card>
    </div>
  );
}
