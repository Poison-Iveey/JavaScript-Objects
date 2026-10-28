import { AppHeader, IconButton } from "shelved";

export const TitleAndSubtitle = () => (
  <AppHeader title="Hello, Maya Okafor" subtitle="4 of 8 books read" />
);

export const TitleOnly = () => <AppHeader title="Settings" />;

export const CategoryPage = () => <AppHeader title="Mystery & Thriller" subtitle="1 book in this genre" />;
