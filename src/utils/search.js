export function filterBooks(books, query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return books;
  return books.filter((book) =>
    [book.title, book.author, book.genre].some((field) => field?.toLowerCase().includes(trimmed))
  );
}
