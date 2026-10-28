import { useState } from "react";
import { SearchBar } from "shelved";

// BookListView renders the search bar full-width in its column; the bar adds
// its own horizontal margin.
const column = { width: 560, paddingTop: 16 } as const;

export const Empty = () => {
  const [query, setQuery] = useState("");
  return (
    <div style={column}>
      <SearchBar value={query} onChange={setQuery} />
    </div>
  );
};

export const WithQuery = () => {
  const [query, setQuery] = useState("Le Guin");
  return (
    <div style={column}>
      <SearchBar value={query} onChange={setQuery} />
    </div>
  );
};

export const Mobile = () => {
  const [query, setQuery] = useState("fantasy");
  return (
    <div style={{ width: 375, paddingTop: 16 }}>
      <SearchBar value={query} onChange={setQuery} />
    </div>
  );
};
