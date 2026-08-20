import { AppShell } from "../components/layout/AppShell.jsx";
import { BookListView } from "../components/books/BookListView.jsx";
import { useBooks } from "../hooks/useBooks.js";

export function FavoritesPage() {
  const { books } = useBooks();
  const favoriteBooks = books.filter((book) => book.isFavorite);

  return (
    <AppShell>
      <BookListView
        title="Favorites"
        books={favoriteBooks}
        emptyMessage="No favorites yet. Mark a book you've read as a favorite to see it here."
      />
    </AppShell>
  );
}
