import { useContext } from "react";
import { BooksContext } from "../context/BooksContext.jsx";

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) throw new Error("useBooks must be used within a BooksProvider.");
  return context;
}
