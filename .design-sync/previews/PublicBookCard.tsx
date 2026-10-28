import { PublicBookCard, SAMPLE_BOOKS } from "shelved";

// PublicProfilePage passes books from the public_books view: no notes and no
// file attachment. Its grid uses minmax(150px, 1fr) tracks.
const toPublic = (book: (typeof SAMPLE_BOOKS)[number]) => ({ ...book, notes: "", fileAttachment: null });
const col = { width: 216, padding: 16 } as const;

export const RatedFavorite = () => (
  <div style={col}>
    <PublicBookCard book={toPublic(SAMPLE_BOOKS[0])} />
  </div>
);

export const CurrentlyReading = () => (
  <div style={col}>
    <PublicBookCard book={toPublic(SAMPLE_BOOKS[1])} />
  </div>
);

export const WantToRead = () => (
  <div style={col}>
    <PublicBookCard book={toPublic(SAMPLE_BOOKS[2])} />
  </div>
);

export const NoCover = () => (
  <div style={col}>
    <PublicBookCard book={{ ...toPublic(SAMPLE_BOOKS[3]), id: "no-cover", coverUrl: null }} />
  </div>
);

export const ProfileGrid = () => (
  <div
    style={{
      width: 720,
      padding: 20,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: 16,
    }}
  >
    {[SAMPLE_BOOKS[0], SAMPLE_BOOKS[1], SAMPLE_BOOKS[4], SAMPLE_BOOKS[3]].map((book) => (
      <PublicBookCard key={book.id} book={toPublic(book)} />
    ))}
  </div>
);
