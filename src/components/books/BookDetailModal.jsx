import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Icon } from "../ui/Icon.jsx";
import { Button, Field, Segmented, StarInput, controlStyles } from "../ui/controls.jsx";
import { useShell } from "../layout/ShellContext.jsx";
import { useLibrary } from "../../hooks/useLibrary.js";
import { STATUSES } from "../../data/community.js";
import styles from "./BookModals.module.css";

export function BookDetailModal() {
  const { detailId, closeDetail, pickImage, notify } = useShell();
  const { byId, updateBook, removeBook } = useLibrary();
  const book = detailId ? byId(detailId) : null;

  if (!book) return null;
  return (
    <Modal title="Book details" onClose={closeDetail} width={880} padding="22px 24px">
      <DetailBody
        key={book.id}
        book={book}
        update={(patch) => updateBook(book.id, patch).catch((e) => notify(e.message))}
        onCover={() => pickImage("detail")}
        onRemove={() =>
          removeBook(book.id)
            .then(closeDetail)
            .catch((e) => notify(e.message))
        }
      />
    </Modal>
  );
}

function DetailBody({ book, update, onCover, onRemove }) {
  // Text fields edit a local draft and save when you leave the field.
  const [draft, setDraft] = useState({
    title: book.title,
    author: book.author,
    pages: book.pages,
    review: book.review,
    notes: book.notes,
  });
  const [quoteDraft, setQuoteDraft] = useState("");

  useEffect(() => {
    setDraft((d) => ({ ...d, pages: book.pages }));
  }, [book.pages]);

  const field = (key, transform = (v) => v) => ({
    value: draft[key],
    onChange: (e) => setDraft((d) => ({ ...d, [key]: e.target.value })),
    onBlur: () => {
      const v = transform(draft[key]);
      if (v !== book[key]) update({ [key]: v });
    },
  });

  const setRead = (r) => update({ read: r, ...(book.pages && r >= book.pages ? { status: "read" } : r > 0 ? { status: "reading" } : {}) });

  const addQuote = () => {
    const t = quoteDraft.trim();
    if (!t) return;
    update({ quotes: [...book.quotes, t] });
    setQuoteDraft("");
  };

  return (
    <div className={styles.detailBody}>
      <div className={styles.left}>
        <div className={styles.top}>
          <button type="button" className={styles.coverButton} onClick={onCover} title="Change cover">
            <img src={book.cover} alt="" />
            <span className={styles.coverCaption}>Change cover</span>
          </button>
          <div className={styles.meta}>
            <input className={styles.titleInput} aria-label="Title" {...field("title", (v) => v.trim() || book.title)} />
            <input className={styles.authorInput} placeholder="Author" aria-label="Author" {...field("author", (v) => v.trim())} />
            <div style={{ marginTop: 4 }}>
              <StarInput value={book.rating} onChange={(rating) => update({ rating })} />
            </div>
            <div className={styles.chips}>
              <Button variant="chip" className={book.fav ? controlStyles.chipOn : undefined} onClick={() => update({ fav: !book.fav })}>
                <Icon name="heart" size={14} stroke="var(--ring1)" strokeWidth={1.7} fill={book.fav ? "var(--ring1)" : "none"} />
                Favorite
              </Button>
              <Button variant="chip" className={book.rec ? controlStyles.chipOn : undefined} onClick={() => update({ rec: !book.rec })}>
                <Icon name="thumb" size={14} stroke="var(--ring1)" strokeWidth={1.7} fill={book.rec ? "var(--ring1)" : "none"} />
                Recommend
              </Button>
            </div>
          </div>
        </div>

        <Segmented
          size="compact"
          items={STATUSES}
          value={book.status}
          onChange={(status) =>
            update({ status, read: status === "read" ? book.pages : status === "want" ? 0 : book.read })
          }
        />

        <div className={styles.progress}>
          <div className={styles.progressRow}>
            <span>Progress · {book.pct}%</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              Page {book.read} of
              <input
                type="number"
                className={styles.pagesInput}
                aria-label="Total pages"
                {...field("pages", (v) => Math.max(0, Number(v) || 0))}
              />
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={book.pages || 0}
            value={book.read}
            aria-label="Pages read"
            onChange={(e) => setRead(Number(e.target.value))}
          />
        </div>

        <Button variant="text" danger className={styles.remove} onClick={onRemove}>
          Remove from library
        </Button>
      </div>

      <div className={styles.right}>
        <Field label="Your review">
          <textarea className={controlStyles.input} rows={3} placeholder="What did you think?" {...field("review")} />
        </Field>
        <Field label="Notes">
          <textarea className={controlStyles.input} rows={4} placeholder="Characters, themes, page references…" {...field("notes")} />
        </Field>
        <div className={styles.stack}>
          <span className={styles.sublabel}>Favorite quotes</span>
          {book.quotes.map((q, i) => (
            <div key={i} className={styles.quote}>
              <span>“{q}”</span>
              <button
                type="button"
                aria-label="Remove quote"
                onClick={() => update({ quotes: book.quotes.filter((_, j) => j !== i) })}
              >
                ×
              </button>
            </div>
          ))}
          <div className={styles.quoteAdd}>
            <input
              className={controlStyles.input}
              value={quoteDraft}
              placeholder="Add a quote"
              onChange={(e) => setQuoteDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addQuote()}
            />
            <Button onClick={addQuote}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
