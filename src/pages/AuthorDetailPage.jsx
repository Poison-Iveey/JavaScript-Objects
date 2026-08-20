import { useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { BookListView } from "../components/books/BookListView.jsx";
import { useBooks } from "../hooks/useBooks.js";

export function AuthorDetailPage() {
  const { author } = useParams();
  const decodedAuthor = decodeURIComponent(author);
  const { books } = useBooks();
  const authorBooks = books.filter((book) => book.author.trim().toLowerCase() === decodedAuthor.trim().toLowerCase());

  return (
    <AppShell>
      <BookListView title={decodedAuthor} books={authorBooks} emptyMessage="No books found for this author." />
    </AppShell>
  );
}
