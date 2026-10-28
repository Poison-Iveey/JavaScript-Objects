import { CategoryIndexList } from "shelved";

const pad = { padding: 16, background: "var(--bg-app)" } as const;

// Hand-derived from SAMPLE_BOOKS the way AuthorsPage / GenresPage do it
// (groupByAuthor / groupByGenre, sorted by name, linked to the detail route).
const authors = [
  "Daphne du Maurier",
  "Emily St. John Mandel",
  "Kazuo Ishiguro",
  "Marcus Aurelius",
  "Michelle Zauner",
  "Robin Wall Kimmerer",
  "Susanna Clarke",
  "Ursula K. Le Guin",
].map((name) => ({ name, count: 1, to: `/authors/${encodeURIComponent(name)}` }));

const genres = [
  "Biography & Memoir",
  "Classic Literature",
  "Fantasy",
  "Fiction",
  "Mystery & Thriller",
  "Non-Fiction",
  "Philosophy",
  "Science Fiction",
].map((name) => ({ name, count: 1, to: `/genres/${encodeURIComponent(name)}` }));

// A bigger shelf, so the counts differ.
const genresLargerShelf = [
  { name: "Classic Literature", count: 12 },
  { name: "Fantasy", count: 7 },
  { name: "Mystery & Thriller", count: 4 },
  { name: "Science Fiction", count: 9 },
  { name: "Uncategorized", count: 2 },
].map(({ name, count }) => ({ name, count, to: `/genres/${encodeURIComponent(name)}` }));

export const Authors = () => (
  <div style={pad}>
    <CategoryIndexList title="Authors" items={authors} emptyMessage="Add some books to see your authors here." />
  </div>
);

export const Genres = () => (
  <div style={pad}>
    <CategoryIndexList title="Genres" items={genres} emptyMessage="Add some books to see your genres here." />
  </div>
);

export const GenresWithCounts = () => (
  <div style={pad}>
    <CategoryIndexList title="Genres" items={genresLargerShelf} emptyMessage="Add some books to see your genres here." />
  </div>
);

export const Empty = () => (
  <div style={pad}>
    <CategoryIndexList title="Authors" items={[]} emptyMessage="Add some books to see your authors here." />
  </div>
);
