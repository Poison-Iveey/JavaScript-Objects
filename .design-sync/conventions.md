# Shelved — building with this library

Shelved (BookBox) is a reading-tracker app with a "Literary Journey" look: warm parchment in light mode, Midnight Ink with antique gold in dark mode. All components are on `window.Shelved`.

## 1. Always wrap in `ShelvedProvider`

Every screen goes inside **one** `ShelvedProvider` at the root. It supplies the signed-in reader, an interactive in-memory shelf (`SAMPLE_BOOKS`, 8 books), the theme and a router. Without it, `BookCard`, `Sidebar`, `ThemeToggle`, `ProfileForm` and anything with navigation throws ("must be used within a …Provider") or renders blank.

```jsx
const { ShelvedProvider, AppShell, BookListView, SAMPLE_BOOKS } = window.Shelved;

<ShelvedProvider theme="dark" initialPath="/library">
  <AppShell>
    <BookListView title="Library" subtitle="Eight books on your shelf" books={SAMPLE_BOOKS} showAddPanel />
  </AppShell>
</ShelvedProvider>
```

- `theme`: `"light"` | `"dark"`. The outermost provider sets `data-theme` on `<html>`, which switches every token. `ThemeToggle` flips it.
- `user={null}` gives signed-out screens (use `AuthForm mode="login" | "signup"`). `books={[]}` gives empty states.
- `initialPath` (`/library`, `/reading`, `/favorites`, `/authors`, `/genres`, `/settings`) picks the active nav item. It only works on the outermost provider.
- A nested `<ShelvedProvider theme="dark">` makes a dark island inside a light page. Modals and sheets portal to `<body>` and always follow the outermost theme.

## 2. Styling idiom: CSS custom properties, no utility classes

Components style themselves (CSS modules; don't target their class names). For your own layout glue, use inline styles or your own CSS with these tokens (all defined in `styles.css` → `_ds_bundle.css`, both themes):

| Purpose | Tokens |
|---|---|
| Surfaces | `--bg-app` (page), `--bg-sidebar`, `--bg-surface` (cards), `--bg-surface-raised`, `--bg-section-band` (section header bands), `--bg-active`, `--bg-input`, `--bg-overlay` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted`, `--heading-color` (gold in dark), `--text-on-accent` |
| Accent | `--accent`, `--accent-strong`, `--accent-fill` (primary buttons), `--accent-gold` (stars, ornaments), `--success`, `--danger` |
| Lines | `--border-subtle`, `--border-strong`, `--card-border`, `--ornament` |
| Type | `--font-display` (Cinzel caps: page/section titles), `--font-serif` (Cormorant Garamond: book titles, quotes), `--font-body` (Inter); sizes `--text-xs` … `--text-3xl` |
| Shape | `--space-1` … `--space-7` (4 → 48px), `--radius-sm`/`md`/`lg`/`pill`, `--shadow-sm`/`md`/`lg` |

A card in the house style: `background: var(--bg-surface); border: 1px solid var(--card-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm)`. `h1`–`h3` automatically get Cinzel and `--heading-color`.

## 3. Where the truth lives

- `styles.css` and its import `_ds_bundle.css`: every token value (light `:root` and `[data-theme="dark"]`) plus component styles.
- `components/<group>/<Name>/<Name>.d.ts` (props) and `<Name>.prompt.md` (usage) for each component. `Book` objects look like `SAMPLE_BOOKS[0]`: `{ id, title, author, pages, status: 'want'|'reading'|'read', rating, genre, notes, isFavorite, coverUrl, fileAttachment }`.
- `sampleCover(title, author, i)` returns themed cover art (data URI) for new sample books.

## 4. Layout facts

- `AppShell` = `Sidebar` (shown at ≥860px) + content column + `BottomNav` (below 860px). Put page content directly inside it, starting with `AppHeader` or a list view that includes one.
- `Button` is `width: 100%`. Size it with its container: a column, or a two-column grid for Cancel/Save rows.
- `BookCard` wants a 150–210px column. Use `BookGrid books={…}` for shelves rather than laying out cards yourself.

```jsx
<div style={{ background: "var(--bg-surface)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", display: "grid", gap: "var(--space-4)", maxWidth: 420 }}>
  <h2 style={{ margin: 0, fontSize: "var(--text-lg)" }}>Reading status</h2>
  <StatusControl value={status} onChange={setStatus} />
  <RatingControl value={rating} onChange={setRating} />
</div>
```
