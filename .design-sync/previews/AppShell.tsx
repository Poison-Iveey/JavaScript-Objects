import { AppShell, BookListView, SAMPLE_BOOKS, ShelvedProvider } from "shelved";

// Dark island: [data-theme="dark"] in theme.css is a plain attribute selector, so
// a wrapper scopes the dark tokens; the nested provider makes useTheme() report
// "dark" (ThemeToggle shows the sun).
const darkScope = { background: "var(--bg-app)", minHeight: "100vh" } as const;

export const Library = () => (
  <AppShell>
    <BookListView title="Hello, Maya Okafor" subtitle="4 of 8 books read" books={SAMPLE_BOOKS} showAddPanel />
  </AppShell>
);

export const EmptyLibrary = () => (
  <ShelvedProvider books={[]} animations={false}>
    <AppShell>
      <BookListView
        title="Hello, Maya Okafor"
        subtitle="Your shelf is waiting"
        books={[]}
        showAddPanel
        emptyMessage="No books yet. Drop a cover above or add one manually to start your shelf."
      />
    </AppShell>
  </ShelvedProvider>
);

export const DarkMode = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={darkScope}>
      <AppShell>
        <BookListView title="Hello, Maya Okafor" subtitle="4 of 8 books read" books={SAMPLE_BOOKS} showAddPanel />
      </AppShell>
    </div>
  </ShelvedProvider>
);
