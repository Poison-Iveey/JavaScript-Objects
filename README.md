# Shelved

A mobile-first personal library app — track the books you've read, attach cover
images and software copies (PDF/EPUB), and browse your shelf in light or dark
"Violet Dusk" theming.

## Status

**Phase 1 (this repo, current):** React + Vite frontend, fully working on a
local/mock data layer (localStorage + IndexedDB) behind a service-layer contract
(`src/services/authService.js`, `src/services/booksService.js`) designed to be
swapped for real calls without touching any components.

Planned next:
- **Phase 2:** Supabase for real accounts, per-user Postgres storage, and file
  storage (covers + ebook attachments).
- **Phase 3:** Capacitor wrapping this same app for Android/iOS and the Google
  Play Store.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
```

## Project structure

- `src/pages/` — one file per screen (Splash, Auth, Library, Settings)
- `src/components/` — shared/reusable view components, grouped by domain
- `src/context/` + `src/hooks/` — wire the service layer into React
- `src/services/` — all business logic (auth, books, storage) — the only
  layer Phase 2 will rewrite
- `src/data/` — pure seed data, no functions
- `src/styles/` — the Violet Dusk theme tokens and typography
