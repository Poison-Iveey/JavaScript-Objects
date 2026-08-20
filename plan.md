# BookBox — Project Plan & Architecture

*Last updated: 2026-07-30. This file is the source of truth for where this project stands and what's next. Read this before doing anything else in a new session.*

*UI note: the user is feature-satisfied but not 100% happy with the current visual design and may want a redesign later once they have inspiration/direction — they don't yet. That's exactly why Play Store submission (which has UI-dependent prep like screenshots) is being deliberately deferred past the Capacitor wrapping step. Don't assume the current visual design is final; a future redesign only ever touches components/pages/styles, nothing backend- or Capacitor-related.*

*Naming note: this project was renamed from "Shelved" to "BookBox" partway through (title, sidebar brand, auth/splash text, share-message copy all updated). If you see "Shelved" anywhere in code/comments, it's a leftover — fix it opportunistically, don't go on a dedicated hunt for it.*

## Vision

BookBox is a mobile-first personal library app: track books you've read, attach cover images and software copies (PDF/EPUB), rate/organize/annotate them, and optionally share a read-only view of your shelf publicly. Aesthetic is "dark academia" — the **Violet Dusk** palette (`#502D55` deep violet, `#935073` mauve, `#F6DBC0` peach, `#F8F4E9` cream), Playfair Display for headings, Inter for body text. End goal: a real working app published to the Google Play Store.

Three phases, planned from the start:
- **Phase 1 — Frontend** ✅ **done**
- **Phase 2 — Backend** (Supabase) ✅ **done** — real Postgres + Auth + Storage, RLS-verified, live in production
- **Phase 3 — Mobile packaging** (Capacitor → Android/Play Store) — Capacitor wrapping ✅ **done**, Play Store submission **deliberately deferred** (see below)

---

## Phase 1 — Frontend (COMPLETE)

Built as a fully working app on **mock/local data** (localStorage + IndexedDB), deliberately structured so Phase 2 swaps in a real backend without touching any component code. Verified end-to-end with Playwright (mobile + desktop, light + dark) after every major change — zero known console errors as of last verification.

### Tech stack (confirmed decisions — don't re-litigate without reason)
- **React + Vite** (chosen over vanilla JS ES modules) — see `package.json`.
- **Styling**: CSS Modules, no Tailwind, no CSS-in-JS. All colors/spacing/radii/fonts come from CSS custom properties in `src/styles/theme.css` / `typography.css` — components never hardcode hex values.
- **Routing**: `react-router-dom`.
- **Animation**: `framer-motion` (splash sequence, modal slide-up, card enter/exit, auth crossfade).
- **Uploads**: `react-dropzone` for drag-and-drop.
- **Icons**: `lucide-react` (clean line icons, styled to fit the palette — there's no literal "dark academia icon pack," this is the practical equivalent).
- **Persistence today**: `localStorage` for JSON data (books, users, theme, sidebar-collapsed), `idb-keyval` (IndexedDB) for actual PDF/EPUB blob storage (localStorage quota is too small/unreliable for real files).
- No state library (Redux/Zustand) — React Context + hooks is sufficient at this scale.

### Architecture — the separation that Phase 2 depends on
```
src/
  services/     ALL business logic. Async functions. Only layer Phase 2 rewrites.
                Never imports React. Talks to storage.js (localStorage/IndexedDB) today,
                will talk to Supabase in Phase 2 — same function signatures either way.
  context/      Wires services into React (AuthContext, BooksContext, ThemeContext).
  hooks/        Thin useContext wrappers (useAuth, useBooks, useTheme).
  components/   View only. Never touch services/ or storage directly — always go
  pages/        through hooks. Organized by domain: books/, layout/, ui/, auth/,
                settings/, profile/.
  data/         Pure data, no functions (genres.js — preset genre list).
  utils/        Pure helper functions (search, formatters, validators, id, aggregate).
  config/       navigation.js — single shared NAV_ITEMS list (icon+label+path) consumed
                by both the desktop Sidebar and the mobile BottomNav/NavDrawer.
  styles/       theme.css (palette tokens + light/dark), typography.css, global.css,
                animations.css.
```

**The rule that must survive into Phase 2**: components call `useAuth()`/`useBooks()`/`useTheme()` and nothing else. `services/*.js` are the only files that know about the storage mechanism. When Phase 2 happens, **only `src/services/*.js` should need to change** (plus maybe `context/*.jsx` if a function signature genuinely needs to change) — if a page or component needs editing to support Supabase, that's a sign the abstraction leaked somewhere.

### What's built (feature inventory)

**Auth** (`services/authService.js`, mock/localStorage):
- `signUp`, `signIn`, `signOut`, `getCurrentUser`, `updateProfile` — plaintext password in localStorage, intentionally (replaced wholesale in Phase 2, argument/return shapes already match Supabase Auth calls).
- `signInWithGoogle` — mock stand-in (signs into a consistent local demo account), since real Google OAuth needs a backend.
- Sharing fields on the user record: `shareSlug` (generated lazily, only when sharing is first enabled), `isProfilePublic`, `profileVisibility` ({ showCurrentlyReading, showFavorites, showRatings }).
- `updateSharingSettings`, `getUserByShareSlug` (self-enforces `isProfilePublic`), `toShareableProfile` (strips email/password — deliberately separate from `toPublicUser`, which keeps email for the owner's own session).

**Books** (`services/booksService.js`, mock/localStorage + IndexedDB for files):
- Book shape: `{ id, title, author, pages, status, rating, genre, notes, isFavorite, coverUrl, fileAttachment }`.
- `status`: 3-state (`want` / `reading` / `read`), **multiple books can be "reading" at once** (no single-bookmark constraint). Replaces an earlier boolean `isRead`.
- `normalizeBook()` runs on every read so old-shaped records self-heal (backfills status/rating/genre/notes/isFavorite from legacy `isRead`) — **there is no separate migration script, it's baked into `readBooks()`**.
- `rating`: integer 1-10 or null, settable anytime.
- `genre`: single value from a **fixed preset list** (`src/data/genres.js`), not freeform — keeps the Genres index/search clean.
- `isFavorite`: boolean, **only togglable when `status === "read"`** — `setStatus()` force-clears it whenever status moves away from `"read"` (real invariant, enforced in the service, not just the UI).
- `notes`: free text, **private** — never returned by `getPublicBooks()`.
- CRUD: `getBooks`, `getBook`, `addBook`, `updateBook` (generic patch, used directly by the UI for rating/genre/notes), `setStatus`, `toggleFavorite`, `removeBook`, `updateCoverImage`, `attachFile`/`removeFileAttachment` (ebook blob in IndexedDB via `putFileBlob`/`getFileBlob`/`deleteFileBlob`), `getAttachedFileBlob`.
- `getPublicBooks(userId, visibility)` — for sharing: **always strips notes**, plus strips rating/favorite/reading-status per the visibility flags. This stripping happens in the service, not just hidden in the UI (anything reachable via devtools must already be sanitized).

**Pages/routes** (`src/App.jsx`):
`/` (splash, animated, auto-routes to `/auth` or `/library`) → `/auth` (square card, Log In/Sign Up tabs, mock "Continue with Google") → `/library`, `/reading`, `/favorites`, `/authors` → `/authors/:author`, `/genres` → `/genres/:genre`, `/settings` (all `ProtectedRoute`-gated) → `/u/:shareSlug` (public, unauthenticated, added before the catch-all route).

**Key UI pieces**:
- `BookCard` — click cover/title opens `BookDetailSheet` (full edit: status, favorite, rating, genre, notes, cover, file, remove). Quick icons on the card itself: change-cover, status-cycle (3 states), favorite (disabled unless read), remove.
- `AddBookSheet` — creation flow: title/author/pages/genre/status, optional cover + ebook attach.
- `AddBookPanel` — inline drag-and-drop-first section at the top of the Library page (no floating action button — that was explicitly removed in favor of this).
- `BookListView` — shared `{title, subtitle, books, showAddPanel}` view (header + optional add-panel + search + grid), reused by Library/Reading/Favorites/Author-detail/Genre-detail so filtering logic isn't duplicated per page.
- `CategoryIndexList` — shared list-of-{name,count,link} component for the Authors and Genres index pages. Authors dedup by `trim().toLowerCase()`, display first-seen casing (no authority list — known limitation). Genres bucket `null` under "Uncategorized".
- `Sidebar` (desktop, ≥860px) — collapsible (icon rail ↔ full labels), preference persisted to localStorage, independent of any context (state lives locally in the component). Contains all of `NAV_ITEMS` + a "Share profile" entry point + theme toggle.
- `BottomNav` (mobile, <860px) — curated to Library / Currently Reading / Settings + a "More" button opening `NavDrawer` (bottom sheet) for Favorites/Authors/Genres.
- `SharingSettings` (in Settings) + `ShareProfileModal` (sidebar quick entry) both reuse `ShareLinkPanel` (copy-link + Twitter/X, Facebook, WhatsApp share-intent buttons — no API keys needed, works today).
- `PublicProfilePage` — **does not use `useAuth()`/`useBooks()`** (those are bound to the signed-in session). Fetches directly via `authService.getUserByShareSlug` + `booksService.getPublicBooks` in a local effect. Shows a private/not-found state if the slug doesn't resolve.

### Verified, real behavior (not just "looks right")
- Sign up → empty shelf (mock data seeding was removed on purpose; new accounts start empty).
- Full status/favorite/rating/genre/notes edit cycle round-trips through reload.
- Search filters by title/author/genre.
- Sidebar collapse persists across reload.
- Mobile "More" drawer reaches Favorites/Authors/Genres.
- Sharing: enabling it generates a slug; the same-browser tab can view the public page with real (sanitized) data; visibility toggles hide fields live; making it private immediately 404-equivalents the link; **a separate browser context (simulated other device) correctly cannot see it** — this is the expected, disclosed limitation of a localStorage-only mock, not a bug.
- `npm run build` passes clean at every checkpoint.

### Known simplifications (intentional, not bugs — revisit if they start to matter)
- No timestamp/ordering field — Currently Reading/Favorites reflect insertion order, not recency.
- Author grouping has no authority list beyond case-insensitive dedup.
- Sharing only works within the same browser until Phase 2.
- Social share buttons are plain share-intent URLs — no rich link-preview cards (needs server-rendered `og:meta` tags, no server yet).
- **The sidebar's visual design was based on my own judgment** — the user mentioned a reference image for the collapsible sidebar look partway through Round 2 but it was never actually attached/received. If they bring it up again, ask for it and reconcile visually; don't assume the current look is final.
- Multiple selectable themes (beyond light/dark Violet Dusk) — explicitly deferred by the user from the very first request, still deferred.
- Real Pinterest integration was never in scope — "upload from Pinterest or camera roll" was interpreted (and confirmed) as a generic device image picker, not a Pinterest API integration.

---

## Phase 2 — Backend (Supabase) (COMPLETE)

Goal achieved exactly as planned: the localStorage/IndexedDB mock was replaced with a real Supabase project (Postgres + Auth + Storage) **without changing any component or page code** — only `src/services/*.js`, `src/context/AuthContext.jsx`, and `src/services/supabaseClient.js` (new) changed. Every page/component still just calls `useAuth()`/`useBooks()`, exactly per the Phase 1 rule.

### What's live now
- **Supabase project** created (dashboard-based, walked through interactively). Credentials in `.env` (gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. A `SUPABASE_SERVICE_ROLE_KEY` (no `VITE_` prefix, so never bundled client-side) is also in `.env` — used only by throwaway local Node scripts for admin-level test/verification work, never imported anywhere in `src/`.
- **Schema**: `profiles` (extends `auth.users`, one row per signup via an `on_auth_user_created` trigger that reads `display_name` from signup metadata) and `books` (all Round 2 fields: `status`/`rating`/`genre`/`notes`/`is_favorite` + flat `file_name`/`file_size`/`file_type` columns instead of a nested object). Full SQL lives in `SUPABASE_SETUP.md`.
- **RLS**: owner-only CRUD on both tables. Sharing is served through two **security-definer views** (`public_profiles`, `public_books`) that deliberately bypass the owner-only RLS to expose *only* the safe, already-filtered columns to `anon`/`authenticated` — `notes` isn't a column in the view at all, and `rating`/`is_favorite`/reading-status are nulled per the owning profile's visibility flags, all in SQL. **Verified directly** (not just "the UI doesn't show it"): signed in as User B, attempted `select`/`update`/`delete` against User A's `books` rows and an `update` against User A's `profiles` row via the plain anon-key client — every single one returned 0 rows / no error, and User A's data was confirmed untouched afterward.
- **Storage**: two buckets, `covers` (public) and `ebooks` (private), each with owner-only write policies keyed off the first path segment (`{user_id}/...`) matching `auth.uid()`.
- **Google OAuth**: real `supabase.auth.signInWithOAuth({provider:'google'})`, configured via a Google Cloud OAuth client wired into Supabase's Auth provider settings. Verified the redirect chain fires correctly end-to-end (app → Supabase `/auth/v1/authorize` → real `accounts.google.com` consent screen scoped to the right project) — a full interactive login wasn't completed (no real Google account to use, and automating a real Google login is both unreliable and against the spirit of bot-detection, so don't try to script past this point again either).
- **Cross-device sharing now genuinely works** — the one thing that was explicitly impossible in Phase 1. Verified with a real separate Playwright browser context (not just a new tab): it saw the real book data (title, rating, genre, favorite) with notes and email both absent, exactly as designed.
- `normalizeBook()` was removed — the Postgres schema's `NOT NULL`/`CHECK` constraints make it unnecessary. `idb-keyval` was removed as a dependency (Supabase Storage replaced its one use).

### Real-world gotchas hit during setup (useful if this ever needs to be redone, e.g. a second environment)
- **`@example.com` emails are rejected outright** by Supabase's signup validator (RFC-reserved test domain) — use a real-domain-shaped address (e.g. `something@gmail.com`) for any manual/scripted testing.
- **Email confirmation ("Confirm sign up") is NOT a toggle in the per-provider Email settings modal** in the current Supabase dashboard — that modal only has OTP/password/security settings. The actual control lives at **Authentication → Emails → Templates → "Confirm sign up"** — though even there, what's shown by default is the *email template editor*, not an obvious on/off switch; it took several rounds of trial-and-error (and tripped the shared SMTP's email rate limit a few times in the process) to work through. If a from-scratch setup needs to disable it again, expect this same hunt — it is not in the obvious place.
- Supabase's shared/default SMTP has a **very low email-send rate limit** — a handful of signup attempts in quick succession will exhaust it and produce a "email rate limit exceeded" error that has nothing to do with your code. A custom SMTP provider removes this ceiling.
- **Storage buckets are not created by the SQL script** — `create policy on storage.objects` runs fine even if the bucket doesn't exist yet, so it's easy to think setup is complete when a bucket was actually never created. This exact miss happened here (the `ebooks` bucket didn't exist, silently breaking ebook-attach with a "Bucket not found" error) and was caught by actually exercising the feature end-to-end, not just running the SQL. **Lesson: after setup, explicitly list buckets and confirm both exist before assuming Storage is ready.**
- For local testing/scripts needing pre-confirmed accounts (bypassing the email flow entirely), `supabase.auth.admin.createUser({ email, password, email_confirm: true })` via the service-role client is the clean path — much more reliable than fighting the dashboard's email-confirmation setting.
- `@supabase/supabase-js`'s realtime client throws on Node 20 without a `ws` package/transport passed in (`realtime: { transport: ws } }`) — only matters for standalone Node scripts hitting Supabase directly (like the admin test scripts), not the browser app itself.
- A couple of test accounts (`bookbox.verify1.*@gmail.com` / `bookbox.verify2.*@gmail.com`) and their books/profiles are sitting in the live Supabase project from this verification pass — harmless, but worth deleting from the dashboard (Authentication → Users) whenever it's convenient.

---

## Phase 3 — Mobile packaging (Capacitor → Android) (WRAPPING DONE, Play Store submission deliberately deferred)

The user isn't 100% happy with the current UI (feature-complete, but wants room to redesign later without a clear direction yet) and explicitly asked to get the Capacitor wrapping done now while holding off on the actual Play Store submission — since some submission prep (screenshots especially) is tied to how the UI currently looks and would need redoing after a redesign. **This is safe to sequence this way**: Capacitor just wraps whatever `npm run build` produces, so a future UI overhaul is exactly as easy post-wrapping as it would've been before — it only ever touches `components/`/`pages/`/`styles/`, never anything under `android/`.

### What's done
- `@capacitor/core`, `@capacitor/android`, `@capacitor/splash-screen`, `@capacitor/status-bar` installed (+ `@capacitor/cli` as a dev dependency). `@capacitor/assets` was installed **temporarily** to generate icons/splash images from `assets/logo.png`, then **uninstalled** once done — it pulled in a large, vulnerable dependency tree (sharp/tar/etc.) that's irrelevant risk for a one-time dev-only asset-generation pass, so removing it afterward was the clean call rather than leaving it installed.
- `capacitor.config.json`: `appId: com.iveey.bookbox`, `appName: BookBox`, `webDir: dist`. SplashScreen and StatusBar configured.
- **Native project scaffolded** at `android/` (gitignore for build artifacts/`local.properties`/synced web assets was auto-generated correctly by `cap add android` — verified, nothing extra needed).
- **Icons + splash generated** from the existing `public/images/bookbox-logo.png` (copied to `assets/logo.png`, the convention `@capacitor/assets` expects) across all Android density buckets, light + dark. **One fix applied by hand afterward**: `SplashPage.jsx` always uses a fixed dark background regardless of system theme (a deliberate earlier branding choice) — but the generated splash assets naturally varied by system light/dark setting, which would've caused a jarring flash (light native splash → dark React splash) for any user on a light-mode phone. Fixed by copying the `-night` (dark) drawable variants over their light counterparts, so the native splash always matches `SplashPage`'s fixed dark look regardless of system setting.
- **Status bar now follows the in-app theme toggle live** — `ThemeContext.jsx` calls `StatusBar.setStyle()`/`setBackgroundColor()` on every theme change, gated behind `Capacitor.isNativePlatform()` so it's a no-op (and safely does nothing) when running as a plain web app. Verified this import doesn't break the web build or throw at runtime in a browser.
- Safe-area CSS (`--safe-top`/`--safe-bottom` via `env(safe-area-inset-*)`) was already in place from Phase 1 — left as-is; it's a harmless no-op on Android's default (non-edge-to-edge) window mode, and only becomes relevant if edge-to-edge is enabled later.
- A real, unrelated security advisory surfaced during this pass: `react-router-dom` has 2 moderate CVEs, but both require a fix that's a major-version bump (v6→v7) and neither is actually exploitable in this app's current usage (no dynamic/user-influenced `navigate()`/`<Navigate>` targets anywhere, and it's a pure client-side SPA with no SSR). Flagged, not fixed — a v7 migration deserves its own dedicated, fully-regression-tested pass, not a rushed fix mid-Capacitor-setup.

### What's NOT done / genuinely can't be verified from here
- **No Java/Android SDK/Gradle in this sandbox** — the native project is scaffolded and configured correctly, but has never actually been compiled. The remaining steps need Android Studio (which bundles the JDK + SDK) on the user's own machine: open the `android/` folder, let Gradle sync, run on an emulator or physical device.
- **Google Sign-In will NOT work out of the box on native as currently wired.** The current `signInWithGoogle()` (in `authService.js`) uses a plain browser redirect (`supabase.auth.signInWithOAuth` + `window.location`), which is correct and verified for the web app, but a Capacitor WebView can't complete an OAuth browser-redirect round-trip the same way. The standard fix is: open the OAuth URL via `@capacitor/browser`'s in-app browser tab instead of a plain redirect, register a custom URL scheme deep link (the `custom_url_scheme` in `strings.xml`, already auto-set to `com.iveey.bookbox`, is the hook for this), and listen for the app resuming via `@capacitor/app`'s `appUrlOpen` event to hand the returned session back to Supabase. This wasn't implemented here because it's impossible to verify without a real device/emulator and a real Google account actually completing the flow — writing unverified native-integration code isn't worth the risk of it being subtly wrong. **Do this properly once Android Studio + a device/emulator are available.** Email/password auth needs no such handling and already works identically on native.
- File input UX (`@capacitor/filesystem`/`@capacitor/camera` for a nicer native photo/file picker instead of the plain browser `<input type="file">`) — still just a nice-to-have per the original plan, not attempted.
- **The app icon's source image includes the full "BookBox / A Box of Knowledge" wordmark lockup**, which will look cluttered/illegible at small home-screen icon sizes (confirmed by viewing the generated `ic_launcher.png`). The splash screen looks great with the full lockup (it's shown large, briefly) but the *icon* specifically would benefit from a cleaner, icon-only crop (just the open-book mark, no text) before this ever ships. Regenerate via `npx capacitor-assets generate --android` (temporarily reinstall `@capacitor/assets` for this, then uninstall again after) once a better source is available.

### Verification checklist once Android Studio is available
- Gradle sync succeeds, app installs and launches on an emulator/device.
- Splash screen handoff looks seamless (no color flash) in both system light and dark mode.
- Status bar color/icon-contrast is correct in both app themes, and updates live when toggling the in-app theme.
- Email/password sign-up, login, and full CRUD work identically to the verified web behavior.
- Cover upload and PDF/EPUB attach work through the WebView's file picker.
- Safe-area insets look right on a real gesture-nav/notched device, not just simulated ones.
- Google Sign-In — implement the native OAuth deep-link handling above, then test with a real Google account.

---

## Deferred / future features (explicitly not now, don't build unprompted)
- Multiple selectable visual themes beyond light/dark Violet Dusk.
- Real Pinterest API browse/search integration (current upload is a generic file picker).
- Rich social-share link previews (`og:meta` tags — needs server-side rendering, doesn't fit a static SPA without extra infrastructure).
- iOS packaging.
- Recency-based ordering (a real `updated_at`/`status_changed_at` timestamp) for Currently Reading/Favorites — currently insertion order.
- Author authority list to fully dedupe near-identical author name spellings.

## Open items
- **UI redesign, whenever the user has direction/inspiration** — they're feature-satisfied but not visually satisfied. Nothing to do until they bring it up; when they do, it's a pure `components/`/`pages/`/`styles/` effort, no backend or Capacitor impact.
- **Resume Phase 3 on the user's own machine**: open `android/` in Android Studio, let Gradle sync, run on an emulator/device, work through the verification checklist in the Phase 3 section above — this environment has no Java/Android SDK, so none of that could be done or verified here.
- **Native Google Sign-In** needs the `@capacitor/browser` + `@capacitor/app` deep-link approach described in Phase 3 before it'll work on the Android build (email/password auth already works fine natively as-is).
- **App icon source** should get a cleaner icon-only crop (no wordmark text) before Play Store submission — see Phase 3 notes.
- Whenever ready to actually submit: confirm the Google Play developer account situation (one-time $25 fee + identity verification, done on Google's side) and decide if `com.iveey.bookbox` is the final app id (it's currently just a reasonable placeholder — changeable freely until first submission, essentially locked in after).
- Delete or keep the leftover `bookbox.verify1/2.*@gmail.com` test accounts in Supabase (see Phase 2 gotchas) — harmless either way, just flagging it's not auto-cleaned-up.
- The real (but currently non-exploitable) `react-router-dom` v6→v7 security advisory from Phase 3 setup — worth its own dedicated upgrade pass eventually, not urgent.
- Still owed: the sidebar reference image mentioned once during an earlier visual-design round — never received it, and lower priority now given the sidebar's since been restyled again on direct instruction. Worth asking again only if sidebar visuals come up.
