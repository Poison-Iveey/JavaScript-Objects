import { AppShell } from "../components/layout/AppShell.jsx";
import { BookListView } from "../components/books/BookListView.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useBooks } from "../hooks/useBooks.js";

export function LibraryPage() {
  const { user } = useAuth();
  const { books, isLoading } = useBooks();
  const readCount = books.filter((book) => book.status === "read").length;

  if (isLoading) return <AppShell />;

  return (
    <AppShell>
      <BookListView
        title={`Hello, ${user.displayName}`}
        subtitle={books.length > 0 ? `${readCount} of ${books.length} books read` : undefined}
        books={books}
        showAddPanel
      />
    </AppShell>
  );
}
