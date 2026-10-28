import { BookCard, SAMPLE_BOOKS } from "shelved";

// BookGrid gives each card a 150-210px column; match that width here.
const grid = { width: 200, padding: 16 } as const;

export const Reading = () => (
  <div style={grid}>
    <BookCard book={SAMPLE_BOOKS[1]} />
  </div>
);

export const ReadWithEbook = () => (
  <div style={grid}>
    <BookCard book={SAMPLE_BOOKS[0]} />
  </div>
);

export const WantToRead = () => (
  <div style={grid}>
    <BookCard book={SAMPLE_BOOKS[2]} />
  </div>
);

export const NoCover = () => (
  <div style={grid}>
    <BookCard
      book={{
        ...SAMPLE_BOOKS[6],
        id: "no-cover",
        coverUrl: null,
      }}
    />
  </div>
);
