import { AppShell } from "../components/layout/AppShell.jsx";
import { CategoryIndexList } from "../components/books/CategoryIndexList.jsx";
import { useBooks } from "../hooks/useBooks.js";
import { groupByAuthor } from "../utils/aggregate.js";

export function AuthorsPage() {
  const { books } = useBooks();
  const items = groupByAuthor(books).map(({ name, count }) => ({
    name,
    count,
    to: `/authors/${encodeURIComponent(name)}`,
  }));

  return (
    <AppShell>
      <CategoryIndexList title="Authors" items={items} emptyMessage="Add some books to see your authors here." />
    </AppShell>
  );
}
