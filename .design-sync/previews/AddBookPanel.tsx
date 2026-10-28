import { AddBookPanel } from "shelved";

// The panel sits at the top of the Library page, under the header and above
// the search bar, spanning the content column.
export const LibraryTop = () => (
  <div style={{ padding: 16, maxWidth: 720 }}>
    <AddBookPanel />
  </div>
);

export const Narrow = () => (
  <div style={{ padding: 16, maxWidth: 360 }}>
    <AddBookPanel />
  </div>
);
