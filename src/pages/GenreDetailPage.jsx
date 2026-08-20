import { useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { BookListView } from "../components/books/BookListView.jsx";
import { useBooks } from "../hooks/useBooks.js";

export function GenreDetailPage() {
  const { genre } = useParams();
  const decodedGenre = decodeURIComponent(genre);
  const { books } = useBooks();
  const genreBooks = books.filter((book) => (book.genre ?? "Uncategorized") === decodedGenre);

  return (
    <AppShell>
      <BookListView title={decodedGenre} books={genreBooks} emptyMessage="No books found in this genre." />
    </AppShell>
  );
}
