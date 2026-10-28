import { BookGrid, ShelvedProvider, SAMPLE_BOOKS } from "shelved";

// Parchment page background, as the grid sits on in the app.
const page = { padding: 16, background: "var(--bg-app)" } as const;

export const FullShelf = () => (
  <div style={page}>
    <BookGrid books={SAMPLE_BOOKS} />
  </div>
);

export const CurrentlyReading = () => (
  <div style={page}>
    <BookGrid books={SAMPLE_BOOKS.filter((book) => book.status === "reading")} />
  </div>
);

export const DarkTheme = () => (
  // The provider's theme is global (<html data-theme>) and the outer light
  // provider wins, so the dark tokens are scoped with data-theme on the wrapper.
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={{ ...page, color: "var(--text-primary)" }}>
      <BookGrid books={SAMPLE_BOOKS.slice(0, 3)} />
    </div>
  </ShelvedProvider>
);

export const EmptyShelf = () => (
  <div style={page}>
    <BookGrid books={[]} />
  </div>
);

export const NoSearchMatches = () => (
  <div style={page}>
    <BookGrid books={[]} emptyMessage="No books match your search." />
  </div>
);
