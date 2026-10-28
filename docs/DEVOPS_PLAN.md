# DevOps plan — Literary Journey (Shelved)

Status: **planned, not yet implemented.** Pick this up once the UI/UX and the full-stack work (moving device-only data into Supabase) are done, and before the first Play Store release.

Context: React + Vite web app, wrapped for Android with Capacitor, backed by Supabase (Postgres, Auth, Storage). Expected scale is about 50 users a year. Keep everything on free tiers, managed services and GitHub Actions. No servers of our own.

---

## Pipelines (GitHub Actions)

### 1. CI: every pull request and every push to `main`
- **Checkout:** `actions/checkout` with `lfs: true` (required, see "Header video" below).
- **Steps:** `npm ci`, then ESLint, then unit tests (Vitest), then `vite build`.
- **Smoke tests:** Playwright end-to-end checks of the main flows: sign in, add a book, edit details and rating, log pages, quotes, challenges.
- **Security:** `npm audit --audit-level=high`.
- **Database guard:** fail if any table in `supabase/migrations` is created without `enable row level security`.
- **Branch rule:** protect `main`; merging requires this workflow to pass.

### 2. Database: migrations and RLS policy tests
- **On PR:** start a local Supabase (`supabase start`, uses Docker), apply all migrations, then run policy tests. They sign in as user A and must not be able to read or write user B's rows or storage files.
- **On merge to `main`:** `supabase db push` to the **dev** project.
- **On release tag:** `supabase db push` to the **prod** project, with manual approval through a GitHub Environment.
- **Secrets:** `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD_DEV`, `SUPABASE_DB_PASSWORD_PROD`, and the project refs.

### 3. Web deploy: preview and production
- **Host:** Vercel, Netlify or Cloudflare Pages. **Enable Git LFS in the host's build settings.**
- **PRs:** a preview deploy per pull request.
- **Production:** deploy on merge to `main`.
- **After each deploy:** check that `/media/header.mp4` is served as a real video, not a ~130-byte LFS pointer, and that `/u/<slug>` share links load.
- **Why the web version is needed:** public profile share links are built from the site's address. Inside the Android app that address is local, so share links need a hosted domain. The admin dashboard also lives here.

### 4. Android release: Play Store
- **Trigger:** pushing a tag `vX.Y.Z`.
- **Build:** checkout with LFS, `npm ci`, `vite build`, `npx cap sync android`, set `versionName` from the tag and auto-increment `versionCode`, then `./gradlew bundleRelease`.
- **Sign:** sign the AAB with the upload keystore from secrets (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`).
- **Upload:** send it to the **internal testing** track with a Play upload action or fastlane (`PLAY_SERVICE_ACCOUNT_JSON`). Promote it to production by hand, as a staged rollout.
- **Release notes:** generate them from `CHANGELOG.md`.
- **One-off requirements:**
  - Use Play App Signing.
  - Back up the upload keystore somewhere safe, outside the repo.
  - New personal developer accounts must run a closed test with at least 12 testers for 14 days before the first production release.

### 5. Admin dashboard (once built)
- **Location:** a separate app in the same repo (npm workspaces), sharing Supabase types and components.
- **Deploy:** same pipeline as #3, to its own subdomain.
- **Privileged actions:** run in Supabase Edge Functions, deployed with `supabase functions deploy` in pipeline #2.

### 6. Scheduled jobs
- **Keep-alive:** a daily lightweight query against prod. Free Supabase projects pause after about a week with no activity.
- **Backup:** a weekly `pg_dump` of prod, uploaded to private storage. Test a restore at least once.

### 7. Dependency updates
- **Dependabot or Renovate:** monthly grouped PRs for npm and GitHub Actions. They go through CI like any other PR.

### 8. Monitoring
- **Sentry (free tier):** web and Capacitor errors. Upload source maps from pipelines #3 and #4 (`SENTRY_AUTH_TOKEN`).
- **Also watch:** Play Console vitals for crashes and ANRs, and the Supabase dashboard logs, including auth logs for unusual sign-in activity.

---

## Header video: Git LFS (don't skip this)
`public/media/header.mp4` (19 MB) is stored with **Git LFS** (`.gitattributes`: `*.mp4 filter=lfs diff=lfs merge=lfs -text`).
- **Every clone needs LFS:** any CI job, web host or build machine without Git LFS gets a small pointer file instead of the video, and the banner and sign-in background break.
- **GitHub free plan:** 1 GB of LFS storage and 1 GB of LFS downloads a month. Frequent CI checkouts count against the downloads, so cache the LFS objects in Actions.
- **Fallback:** if a host can't fetch LFS, serve the video from Supabase Storage or a CDN instead.

---

## Environments
| | dev | prod |
|---|---|---|
| Supabase project | `shelved-dev` | `shelved-prod` |
| Web | PR previews and `main` | production domain |
| Android | internal testing track | production track |

- **Env files:** `.env.local` for development (gitignored). Production env vars live in the host's settings and GitHub Secrets.
- **Never commit** the `service_role` key, the keystore or any secret.

---

## Security checklist (user accounts and data)
- [ ] RLS enabled on **every** table, with policies scoped to `auth.uid()`, plus policy tests (pipeline #2).
- [ ] `service_role` key only in Edge Functions and CI secrets, never in app or admin front-end code.
- [ ] Admin access enforced on the server side (`admins` table or role claim, checked by RLS or Edge Functions), not only hidden in the UI.
- [ ] Auth settings: email confirmation on, a minimum password length, and redirect URLs restricted to the exact domains and app scheme.
- [ ] MFA on the Supabase, GitHub, Google Play Console and hosting accounts, and for admin users.
- [ ] Storage: the ebooks bucket private and scoped per user. Covers and avatars public by design, stated in the privacy policy.
- [ ] Device-only journal data (progress, reviews, quotes, log, challenges, profile extras, settings) moved into Supabase tables under RLS.
- [ ] **Play requirement:** in-app account deletion plus a web deletion link. An Edge Function deletes the user's rows, files and auth user.
- [ ] **Play requirement:** a privacy policy URL and an accurate Data Safety form (email, name, photo, reading data).
- [ ] Weekly backups with a tested restore (pipeline #6).
- [ ] Secrets rotated if they may have leaked. Dependabot and `npm audit` kept green.

---

## Tools considered and deferred
| Tool | Decision |
|---|---|
| Docker | **Local development only:** the Supabase CLI uses it to run a local database for migrations and RLS tests. Not used for deployment. |
| Terraform | Deferred. Revisit only if environments multiply. Database schema stays in Supabase migrations. |
| Ansible / Chef | Not needed: there are no self-managed servers. |
| Grafana | Not needed: the Supabase dashboard, Sentry and Play Console vitals cover monitoring at this scale. |
| Azure | Not needed: moving off managed Supabase would mean running our own database and auth, with more cost and more security risk. |

Reconsider these if the app moves to self-hosted infrastructure or grows well beyond the current scale.

---

## Suggested order of implementation
1. Commit the redesign. Add pipeline #1 (CI with LFS checkout, ESLint, tests) and protect `main`.
2. Create the dev/prod Supabase projects. Move device-only data into tables with RLS, and set up pipeline #2.
3. Pipeline #3: web hosting with previews, plus the video and share-link checks.
4. Pipeline #4: signed AAB to Play internal testing, then the closed test.
5. Pipelines #6–#8: keep-alive and backups, dependency updates, Sentry.
6. Admin dashboard (pipeline #5).
