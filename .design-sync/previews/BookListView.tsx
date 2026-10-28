import { BookListView, ShelvedProvider, SAMPLE_BOOKS, SAMPLE_USER } from "shelved";

// Parchment page background, as the view sits on in the app.
const pad = { padding: 16, background: "var(--bg-app)" } as const;
const readCount = SAMPLE_BOOKS.filter((book) => book.status === "read").length;

export const Library = () => (
  <div style={pad}>
    <BookListView
      title={`Hello, ${SAMPLE_USER.displayName}`}
      subtitle={`${readCount} of ${SAMPLE_BOOKS.length} books read`}
      books={SAMPLE_BOOKS}
      showAddPanel
    />
  </div>
);

export const CurrentlyReading = () => (
  <div style={pad}>
    <BookListView
      title="Currently Reading"
      books={SAMPLE_BOOKS.filter((book) => book.status === "reading")}
      emptyMessage="You're not currently reading anything. Mark a book as Reading from your library."
    />
  </div>
);

export const Favorites = () => (
  <div style={pad}>
    <BookListView
      title="Favorites"
      books={SAMPLE_BOOKS.filter((book) => book.isFavorite)}
      emptyMessage="No favorites yet. Mark a book you've read as a favorite to see it here."
    />
  </div>
);

export const DarkTheme = () => (
  // The provider's theme is global (<html data-theme>) and the outer light
  // provider wins, so the dark tokens are scoped with data-theme on the wrapper.
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={{ ...pad, color: "var(--text-primary)" }}>
      <BookListView
        title="Currently Reading"
        books={SAMPLE_BOOKS.filter((book) => book.status === "reading")}
        emptyMessage="You're not currently reading anything. Mark a book as Reading from your library."
      />
    </div>
  </ShelvedProvider>
);

export const EmptyLibrary = () => (
  <ShelvedProvider books={[]} animations={false}>
    <div style={pad}>
      <BookListView title={`Hello, ${SAMPLE_USER.displayName}`} books={[]} showAddPanel />
    </div>
  </ShelvedProvider>
);

export const EmptyFavorites = () => (
  <div style={pad}>
    <BookListView
      title="Favorites"
      books={[]}
      emptyMessage="No favorites yet. Mark a book you've read as a favorite to see it here."
    />
  </div>
);
