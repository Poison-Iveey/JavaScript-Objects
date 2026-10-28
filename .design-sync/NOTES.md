# design-sync notes — Shelved (BookBox)

## Shape and build
- This repo is an **app** (Vite + React, JSX, no TypeScript, no Storybook, no library `dist/`). Shape = `package` with a hand-written entry:
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/setup/index.jsx --out ./ds-bundle`
  No `buildCmd`: the converter bundles straight from `src/` via that entry.
- `.design-sync/setup/index.jsx` re-exports the real components from `src/components/**` plus `ShelvedProvider`, `SAMPLE_BOOKS`, `SAMPLE_USER`, `sampleCover`, `GENRES` and `NAV_ITEMS`. **Add every new component there AND to `componentSrcMap` + `dtsPropsFor` in config.json.** Nothing is auto-discovered: there's no `.d.ts`, so components missing from the map are silently skipped.
- **Supabase is stubbed.** `.design-sync/tsconfig.json` `paths` maps `./supabaseClient.js` and `../services/supabaseClient.js` to `setup/supabaseStub.js`. Without it the real client is bundled, throws on load (no `import.meta.env` in the IIFE) and could embed `.env` values. After each build, verify with `grep -c "@supabase/" ds-bundle/_ds_bundle.js` (must be 0). The converter's tsconfig reader strips `//` as comments, so never put a `"//"` key or a URL containing `//` in that file.
- `dtsPropsFor` is hand-written for every component (JSX has no types). `Book` and `Reader` shapes are inlined: an undefined type name in a `.d.ts` is useless to the design agent.
- Groups come from the `src/components/<dir>` name. `ui/` is a "generic" dir to the converter, so those components are regrouped to `core` via stub docs in `.design-sync/docs/<Name>.md` (`category: Core`). The provider lives in `.design-sync/setup/`, hence group `setup`.
- Moving untracked dirs: use plain `mv`, not `git mv -k` (it silently no-ops on untracked files).

## Rendering
- Every preview card is wrapped in `ShelvedProvider` with `animations: false` (cfg.provider.props). The capture harness freezes the clock, so framer-motion entrance animations (BookCard, Modal, sheets) would otherwise stay at opacity 0 and capture blank. In designs, animations play normally (default `animations: true`).
- `Button` is `width: 100%` by design. Size it with its container (a column stack, or a 2-col grid for cancel/submit rows), not a flex row.
- `BookCard` needs a column ~150-210px wide (BookGrid's track). Wrap single cards in `width: 200`.
- Chromium: playwright from `.ds-sync/node_modules` pins a newer build than the cached one. Run validate/capture with `DS_CHROMIUM_PATH=$HOME/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`.
- Responsive split at 860px: `Sidebar` is `display: none` below 860px and `BottomNav` is hidden at 860px and above. Cards use `single` mode with a desktop viewport (Sidebar 960x720, AppShell 1100x720) or a phone viewport (BottomNav 390x240).
- Overlays (`Modal`, `ConfirmDialog`, `AddBookSheet`, `BookDetailSheet`, `NavDrawer`, `ShareProfileModal`) portal to `<body>` and use `cardMode: single` at 420x760.
- Fonts: Cinzel (display caps), Cormorant Garamond (book titles, quotes), Inter (UI). All come from a Google Fonts `@import` in `src/styles/typography.css` (`[FONT_REMOTE]`, expected).
- Theme (Oct 2026 redesign, "Literary Journey"): light = parchment `#f5f1ec`, white cards, dusty-rose `#eadfdb` section bands, rosewood `#8c6e67` accent; dark (`data-theme="dark"`) = Midnight Ink `#100e1c` page, Velvet Plum `#1c1830` sidebar, Arcane Violet `#28223d` cards, Twilight Amethyst `#42365f` active, Moonlit Lilac `#b9a0e8` highlights, Antique Gold `#d6b875` headings/primary/stars, Enchanted Sage `#8cb8ac` success. Tokens live in `src/styles/theme.css`.
- Nested `ShelvedProvider` (a provider inside another one, detected via `useContext(ThemeContext)`):
  - reuses the outer router (`useInRouterContext`). Before that fix it crashed with "You cannot render a <Router> inside another <Router>" and blanked the card. As a result a nested `initialPath` is ignored, so active-route variants (Sidebar/BottomNav/NavDrawer "ReadingActive") look identical to the default `/library`; don't author them.
  - scopes its `theme` to a `display: contents` `<div data-theme>` instead of `<html>`. Only the outermost provider writes `<html data-theme>`. Before that fix, the outer light provider's effect ran last and every nested dark island rendered light. `theme.css` defines tokens on both `:root, [data-theme="light"]` and `[data-theme="dark"]`, so islands work both ways.
  - inherits the outer `animations` setting unless given one explicitly. Otherwise a nested provider would turn animations back on and capture blank.
- Dark cells in previews: nested `<ShelvedProvider theme="dark">` plus a wrapper div with `data-theme="dark"`, `background: var(--bg-app)` and `color: var(--text-primary)`. The explicit wrapper attribute predates the provider fix and is harmless.
- Portaled overlays (Modal, ConfirmDialog, sheets, NavDrawer, ShareProfileModal) render into `<body>`, outside any island, so they can't have a dark cell. They follow `<html>`, i.e. the outermost provider.
- Capture harness cells sit on white, not parchment. Page-like previews wrap themselves in `background: var(--bg-app)`.
- Capture shots are 900x700 and not full-page, so tall column cards (BookGrid FullShelf, BookListView Library) are cut at the bottom of review sheets. That's a capture artifact, not a render bug.

## Known gaps
- `AppHeader` and `Sidebar` render `<img src="/images/bookbox-logo.png">` (an absolute path to `public/`). It does not resolve inside Claude Design, so the logo shows as alt text "BookBox". Fixing it means changing the app source (import the logo, or make it a component prop). Left as-is pending the owner's call.

- Share links (`SharingSettings`, `ShareProfileModal`, `ShareLinkPanel` inside them) are built from `window.location.origin`, so cards show `http://127.0.0.1:<port>/u/maya-reads` locally and the design host's origin in Claude Design. That's correct app behavior. A cleaner preview would need an optional base-URL prop in `src/`, which is the owner's call. Those cells are graded good with this note.
- `Input` has no `:disabled` style in `src/components/ui/FormField.module.css`, so it has no Disabled cell. Adding the style is the owner's call.

## Known render warns
- `[RENDER_BLANK] BottomNav`: validate screenshots the card at a desktop width, where BottomNav is `display: none` (>=860px). In the product the card uses its declared 390x240 viewport, and the solo review captures show it correctly.
- `[RENDER_THIN] AppShell`, `[RENDER_THIN] ShelvedProvider`: "rendered height 0px". The nested provider's `display: contents` theme wrapper has no box to measure. The screenshots render fully.
