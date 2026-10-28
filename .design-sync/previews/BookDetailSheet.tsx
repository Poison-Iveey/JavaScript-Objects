import { BookDetailSheet, SAMPLE_BOOKS } from "shelved";

const noop = () => {};

export const ReadFavorite = () => <BookDetailSheet book={SAMPLE_BOOKS[0]} isOpen={true} onClose={noop} />;

export const CurrentlyReading = () => <BookDetailSheet book={SAMPLE_BOOKS[1]} isOpen={true} onClose={noop} />;

export const WantToRead = () => <BookDetailSheet book={SAMPLE_BOOKS[2]} isOpen={true} onClose={noop} />;

export const NoCover = () => (
  <BookDetailSheet
    book={{ ...SAMPLE_BOOKS[6], id: "detail-no-cover", coverUrl: null, pages: null, genre: null }}
    isOpen={true}
    onClose={noop}
  />
);
