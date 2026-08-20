import { useState } from "react";
import { AppHeader } from "../layout/AppHeader.jsx";
import { AddBookPanel } from "./AddBookPanel.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { BookGrid } from "./BookGrid.jsx";
import { filterBooks } from "../../utils/search.js";

export function BookListView({ title, subtitle, books, showAddPanel = false, emptyMessage }) {
  const [query, setQuery] = useState("");
  const visibleBooks = filterBooks(books, query);

  return (
    <>
      <AppHeader title={title} subtitle={subtitle} />
      {showAddPanel && <AddBookPanel />}
      {books.length > 0 && <SearchBar value={query} onChange={setQuery} />}
      <BookGrid
        books={visibleBooks}
        emptyMessage={query.trim() ? "No books match your search." : emptyMessage}
      />
    </>
  );
}
