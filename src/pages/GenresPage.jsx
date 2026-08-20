import { AppShell } from "../components/layout/AppShell.jsx";
import { CategoryIndexList } from "../components/books/CategoryIndexList.jsx";
import { useBooks } from "../hooks/useBooks.js";
import { groupByGenre } from "../utils/aggregate.js";

export function GenresPage() {
  const { books } = useBooks();
  const items = groupByGenre(books).map(({ name, count }) => ({
    name,
    count,
    to: `/genres/${encodeURIComponent(name)}`,
  }));

  return (
    <AppShell>
      <CategoryIndexList title="Genres" items={items} emptyMessage="Add some books to see your genres here." />
    </AppShell>
  );
}
