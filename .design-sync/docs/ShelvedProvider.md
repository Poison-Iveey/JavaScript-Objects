---
category: Setup
---

Root wrapper for every Shelved screen. Wrap the whole design in it once, at the top.

It provides what the components read through context:

- **Auth**: a signed-in reader (`SAMPLE_USER`, "Maya Okafor") for `Sidebar`, `ProfileForm`, `SharingSettings`, `ShareProfileModal` and `AuthForm`.
- **Books**: an interactive, in-memory shelf (`SAMPLE_BOOKS`, 8 books across Want to Read / Reading / Read). `BookCard`, `BookDetailSheet` and `AddBookSheet` really favorite, re-status, edit, add and remove books.
- **Theme**: `light` or `dark`. It sets `data-theme` on `<html>`, which switches every color token. `ThemeToggle` flips it.
- **Router**: an in-memory router. `Sidebar`, `BottomNav`, `NavDrawer` and `CategoryIndexList` render real `NavLink`s and highlight the active route.

Without it, `useAuth`, `useBooks` and `useTheme` throw ("must be used within a …Provider") and navigation components crash.

```jsx
const { ShelvedProvider, AppShell, BookListView, SAMPLE_BOOKS } = window.Shelved;

<ShelvedProvider theme="light" initialPath="/library">
  <AppShell>
    <BookListView title="Library" subtitle="8 books" books={SAMPLE_BOOKS} showAddPanel />
  </AppShell>
</ShelvedProvider>
```

Signed-out screens (sign-in, splash):

```jsx
<ShelvedProvider user={null}>
  <AuthForm mode="login" />
</ShelvedProvider>
```

Pass your own `books` to show a specific shelf, such as an empty state: `books={[]}`.
