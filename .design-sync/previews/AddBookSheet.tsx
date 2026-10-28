import { AddBookSheet, sampleCover } from "shelved";

const noop = () => {};

// A cover dropped on the Library's AddBookPanel opens the sheet with it
// pre-attached (initialCoverFile).
function coverFile() {
  const dataUrl = sampleCover("The Overstory", "Richard Powers", 2);
  const svg = decodeURIComponent(dataUrl.slice(dataUrl.indexOf(",") + 1));
  return new File([svg], "the-overstory-cover.svg", { type: "image/svg+xml" });
}

export const Blank = () => <AddBookSheet isOpen={true} onClose={noop} />;

export const WithDroppedCover = () => <AddBookSheet isOpen={true} onClose={noop} initialCoverFile={coverFile()} />;
