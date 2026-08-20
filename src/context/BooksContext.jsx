import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as booksService from "../services/booksService.js";
import { useAuth } from "../hooks/useAuth.js";

export const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    booksService.getBooks(user.id).then((loaded) => {
      setBooks(loaded);
      setIsLoading(false);
    });
  }, [user]);

  const addBook = useCallback(
    async (fields) => {
      const book = await booksService.addBook(user.id, fields);
      setBooks((current) => [book, ...current]);
      return book;
    },
    [user]
  );

  const updateBook = useCallback(
    async (bookId, patch) => {
      const updated = await booksService.updateBook(user.id, bookId, patch);
      setBooks((current) => current.map((book) => (book.id === bookId ? updated : book)));
      return updated;
    },
    [user]
  );

  const setStatus = useCallback(
    async (bookId, status) => {
      const updated = await booksService.setStatus(user.id, bookId, status);
      setBooks((current) => current.map((book) => (book.id === bookId ? updated : book)));
      return updated;
    },
    [user]
  );

  const toggleFavorite = useCallback(
    async (bookId) => {
      const updated = await booksService.toggleFavorite(user.id, bookId);
      setBooks((current) => current.map((book) => (book.id === bookId ? updated : book)));
      return updated;
    },
    [user]
  );

  const removeBook = useCallback(
    async (bookId) => {
      await booksService.removeBook(user.id, bookId);
      setBooks((current) => current.filter((book) => book.id !== bookId));
    },
    [user]
  );

  const attachFile = useCallback(
    async (bookId, file) => {
      const updated = await booksService.attachFile(user.id, bookId, file);
      setBooks((current) => current.map((book) => (book.id === bookId ? updated : book)));
      return updated;
    },
    [user]
  );

  const updateCoverImage = useCallback(
    async (bookId, file) => {
      const updated = await booksService.updateCoverImage(user.id, bookId, file);
      setBooks((current) => current.map((book) => (book.id === bookId ? updated : book)));
      return updated;
    },
    [user]
  );

  const removeFileAttachment = useCallback(
    async (bookId) => {
      const updated = await booksService.removeFileAttachment(user.id, bookId);
      setBooks((current) => current.map((book) => (book.id === bookId ? updated : book)));
      return updated;
    },
    [user]
  );

  const value = useMemo(
    () => ({
      books,
      isLoading,
      addBook,
      updateBook,
      setStatus,
      toggleFavorite,
      removeBook,
      attachFile,
      updateCoverImage,
      removeFileAttachment,
    }),
    [
      books,
      isLoading,
      addBook,
      updateBook,
      setStatus,
      toggleFavorite,
      removeBook,
      attachFile,
      updateCoverImage,
      removeFileAttachment,
    ]
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}
