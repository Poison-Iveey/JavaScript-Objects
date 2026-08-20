# Supabase Setup Guide (Phase 2)

Follow this in order. Steps 1-2 need your own browser session (I can't do these for you). Once you've got the Project URL + anon key, hand them back to me and I'll take it from there — the actual code rewrite is on me, not you.

---

## 1. Create your Supabase account + project

1. Go to https://supabase.com and sign up (GitHub login is the fastest option).
2. Click **New Project**.
3. Fill in:
   - **Name**: `bookbox` (or whatever you like — cosmetic only)
   - **Database password**: generate a strong one and save it somewhere safe (a password manager). You won't need it for the app itself (the anon key handles that), but you'll want it if you ever need direct Postgres access.
   - **Region**: pick whichever is closest to you.
4. Click **Create new project** and wait ~2 minutes for it to provision.

## 2. Get your Project URL and anon key

1. In your new project, go to **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`).
3. Copy the **anon / public** key (a long string starting with `eyJ...`). This one is safe to expose client-side — Row Level Security is what actually protects your data, not keeping this key secret.
4. Create a file named `.env` in the project root (`/home/iveey/JavaScript-Objects/.env` — it's already gitignored) with:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Tell me once this file exists — I'll take it from there for the code side.

## 3. Run the database schema

Go to the **SQL Editor** in your Supabase project (left sidebar), paste everything below, and click **Run**.

```sql
-- ============================================================
-- PROFILES — one row per user, extends the built-in auth.users
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  share_slug text unique,
  is_profile_public boolean not null default false,
  show_currently_reading boolean not null default true,
  show_favorites boolean not null default true,
  show_ratings boolean not null default true,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profiles row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    null
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BOOKS
-- ============================================================
create table books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text not null,
  pages integer,
  status text not null default 'want' check (status in ('want', 'reading', 'read')),
  rating integer check (rating between 1 and 10),
  genre text,
  notes text not null default '',
  is_favorite boolean not null default false,
  cover_url text,
  file_name text,
  file_size integer,
  file_type text,
  created_at timestamptz not null default now()
);

alter table books enable row level security;

create policy "Users can manage their own books"
  on books for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- PUBLIC SHARING VIEWS
-- These run with the view owner's privileges (Postgres 15 default),
-- deliberately bypassing the owner-only RLS above so anonymous
-- visitors can read *only* what's meant to be public — the same
-- "strip in the data layer, not just the UI" rule from Phase 1,
-- now enforced in SQL instead of JS. Notes are never selected here
-- at all, and rating/favorite/reading-status are nulled out per each
-- profile's own visibility toggles.
-- ============================================================
create view public_profiles as
select id, display_name, avatar_url, share_slug
from profiles
where is_profile_public = true;

create view public_books as
select
  b.id,
  b.user_id,
  b.title,
  b.author,
  b.pages,
  case when p.show_currently_reading then b.status
       else (case when b.status = 'reading' then 'want' else b.status end)
  end as status,
  case when p.show_ratings then b.rating else null end as rating,
  b.genre,
  case when p.show_favorites then b.is_favorite else false end as is_favorite,
  b.cover_url
from books b
join profiles p on p.id = b.user_id
where p.is_profile_public = true;

grant select on public_profiles to anon, authenticated;
grant select on public_books to anon, authenticated;
```

## 4. Create Storage buckets

Go to **Storage** in the left sidebar:

1. Click **New bucket** → name it `covers` → toggle **Public bucket** ON (cover images aren't sensitive) → Create.
2. Click **New bucket** → name it `ebooks` → leave **Public bucket** OFF (these are private files) → Create.

Then back in the **SQL Editor**, run:

```sql
-- Covers: public read, owner-only write. Files live at {user_id}/{filename}.
create policy "Public read access for covers"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Users can upload their own covers"
  on storage.objects for insert
  with check (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own covers"
  on storage.objects for update
  using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own covers"
  on storage.objects for delete
  using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);

-- Ebooks: fully private, owner-only read/write. No public policy at all —
-- the sharing feature never exposes file attachments.
create policy "Users can access their own ebooks"
  on storage.objects for select
  using (bucket_id = 'ebooks' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload their own ebooks"
  on storage.objects for insert
  with check (bucket_id = 'ebooks' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own ebooks"
  on storage.objects for update
  using (bucket_id = 'ebooks' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own ebooks"
  on storage.objects for delete
  using (bucket_id = 'ebooks' and (storage.foldername(name))[1] = auth.uid()::text);
```

## 5. Set up Google OAuth

### 5a. Google Cloud Console
1. Go to https://console.cloud.google.com/ and create a new project (or use an existing one).
2. Go to **APIs & Services** → **OAuth consent screen**. Choose **External**, fill in the required fields (app name "BookBox", your email), save.
3. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Name: anything, e.g. "BookBox Supabase".
   - You'll need the **redirect URI** from Supabase before finishing this — go do step 5b first, then come back and paste it into **Authorized redirect URIs** here.
4. Once saved, copy the **Client ID** and **Client Secret**.

### 5b. Supabase Auth settings
1. In Supabase, go to **Authentication** → **Providers** → find **Google** and enable it.
2. Supabase shows you a **Callback URL (for OAuth)** here — copy that, go back to Google Cloud Console step 5a.3 above, and paste it into **Authorized redirect URIs**.
3. Back in Supabase, paste the **Client ID** and **Client Secret** from Google into the Google provider settings, and save.

## 6. Once all of the above is done

Tell me, and confirm:
- [ ] `.env` file created with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] SQL from step 3 ran without errors
- [ ] Both storage buckets created + policies from step 4 ran without errors
- [ ] Google provider enabled in Supabase with Client ID/Secret saved

I'll then rewrite `authService.js` and `booksService.js` to talk to Supabase instead of localStorage, and we'll test everything end-to-end together.
