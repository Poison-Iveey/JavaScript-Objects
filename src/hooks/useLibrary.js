import { useCallback, useEffect, useMemo, useState } from "react";
import { useBooks } from "./useBooks.js";
import { useJournal } from "./useJournal.js";
import { coverIndex, generatedCover, whenCoverFontsReady } from "../utils/covers.js";

// Book fields stored in Supabase vs. in the on-device journal.
const DB_FIELDS = ["title", "author", "pages", "status", "rating", "notes", "isFavorite"];

// One book as the UI sees it: Supabase row + journal extras, with a cover.
function toView(book, extra = {}) {
  const pages = book.pages || 0;
  const read = book.status === "read" ? extra.read ?? pages : book.status === "want" ? 0 : Math.min(pages || Infinity, extra.read ?? 0);
  const pct = pages ? Math.min(100, Math.round((read / pages) * 100)) : 0;
  const rating = Math.min(5, book.rating || 0);
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    pages,
    read,
    pct,
    status: book.status,
    rating,
    notes: book.notes || "",
    fav: !!book.isFavorite,
    rec: !!extra.rec,
    review: extra.review || "",
    quotes: extra.quotes || [],
    coverUrl: book.coverUrl,
    cover: book.coverUrl || generatedCover({ cov: coverIndex(book.id), text: book.title }),
  };
}

export function useLibrary() {
  const booksCtx = useBooks();
  const journal = useJournal();
  const [fontTick, setFontTick] = useState(0);

  // Generated covers need the webfonts; redraw once they've loaded.
  useEffect(() => {
    whenCoverFontsReady().then(() => setFontTick((n) => n + 1));
  }, []);

  const books = useMemo(
    () => booksCtx.books.map((b) => toView(b, journal.books[b.id])),
    // fontTick: recompute generated covers once the fonts are in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [booksCtx.books, journal.books, fontTick]
  );

  const byId = useCallback((id) => books.find((b) => b.id === id) ?? null, [books]);

  // Applies a UI patch, splitting it between Supabase and the journal.
  const updateBook = useCallback(
    async (id, patch) => {
      const db = {};
      const local = {};
      for (const [k, v] of Object.entries(patch)) {
        if (k === "fav") db.isFavorite = v;
        else if (k === "rating") db.rating = v > 0 ? v : null;
        else if (DB_FIELDS.includes(k)) db[k] = v;
        else local[k] = v;
      }
      if (Object.keys(local).length) journal.patchBook(id, local);
      if (Object.keys(db).length) await booksCtx.updateBook(id, db);
    },
    [booksCtx, journal]
  );

  const addBook = useCallback(
    async ({ title, author, pages, status, coverFile }) => {
      const book = await booksCtx.addBook({ title, author, pages, status, coverImageFile: coverFile });
      if (status === "read") journal.patchBook(book.id, { read: Number(pages) || 0 });
      return book;
    },
    [booksCtx, journal]
  );

  const removeBook = useCallback(
    async (id) => {
      await booksCtx.removeBook(id);
      journal.forgetBook(id);
    },
    [booksCtx, journal]
  );

  // Logs pages read today and advances the book's progress (finishing it
  // when the last page is reached).
  const logPages = useCallback(
    async (id, pages) => {
      const b = byId(id);
      if (!b || !pages) return;
      journal.addLog(id, pages);
      const read = Math.min(b.pages || 9999, b.read + pages);
      const status = b.pages && read >= b.pages ? "read" : "reading";
      journal.patchBook(id, { read });
      if (status !== b.status) await booksCtx.updateBook(id, { status });
    },
    [booksCtx, byId, journal]
  );

  return {
    books,
    isLoading: booksCtx.isLoading,
    byId,
    updateBook,
    addBook,
    removeBook,
    logPages,
    setCover: booksCtx.updateCoverImage,
  };
}
