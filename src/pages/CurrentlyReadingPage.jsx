import { AppShell } from "../components/layout/AppShell.jsx";
import { BookListView } from "../components/books/BookListView.jsx";
import { useBooks } from "../hooks/useBooks.js";

export function CurrentlyReadingPage() {
  const { books } = useBooks();
  const readingBooks = books.filter((book) => book.status === "reading");

  return (
    <AppShell>
      <BookListView
        title="Currently Reading"
        books={readingBooks}
        emptyMessage="You're not currently reading anything. Mark a book as Reading from your library."
      />
    </AppShell>
  );
}
