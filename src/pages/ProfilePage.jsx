import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Button, Field, Segmented, ToggleRow, controlStyles } from "../components/ui/controls.jsx";
import { ProfileView, sampleCover } from "../components/profile/ProfileView.jsx";
import { useShell } from "../components/layout/ShellContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useJournal } from "../hooks/useJournal.js";
import { useLibrary } from "../hooks/useLibrary.js";
import { useTheme } from "../hooks/useTheme.js";
import { PROFILE_GENRES, READERS } from "../data/community.js";
import { initials } from "../utils/dates.js";
import styles from "../components/profile/profile.module.css";

const PROFILE_TABS = [
  { value: "public", label: "Public profile" },
  { value: "edit", label: "Edit profile" },
];

// Your own profile: the public view, or the editor.
export function ProfilePage() {
  const { tab = "public" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const journal = useJournal();
  const { books } = useLibrary();
  const { openDetail } = useShell();
  const vis = user.profileVisibility;

  const profile = {
    name: user.displayName,
    handle: journal.profile.handle,
    bio: journal.profile.bio || "Add a bio in Edit profile.",
    genres: journal.profile.genres,
    avatar: user.avatarUrl,
    books: books.map((b) => ({ ...b, open: () => openDetail(b.id) })),
    followers: 12,
    following: journal.following.length,
    isSelf: true,
    privateNote: !user.isProfilePublic,
    likePrefix: "me",
    show: {
      favs: vis.showFavorites,
      recs: journal.profile.vis.recs !== false,
      read: journal.profile.vis.read !== false,
      reviews: vis.showRatings,
    },
  };

  return (
    <>
      <Segmented
        items={PROFILE_TABS}
        value={tab}
        onChange={(v) => navigate(v === "edit" ? "/profile/edit" : "/profile")}
        style={{ marginTop: 24, maxWidth: 340 }}
      />
      {tab === "edit" ? <EditProfile /> : <ProfileView profile={profile} onEdit={() => navigate("/profile/edit")} />}
    </>
  );
}

// Another reader's profile (/readers/:readerId).
export function ReaderPage() {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const { following, toggleFollow } = useJournal();
  const reader = READERS.find((r) => r.id === readerId);
  if (!reader) return <p style={{ marginTop: 24, color: "var(--muted)" }}>This reader doesn't exist.</p>;
  const isFollowing = following.includes(reader.id);

  const profile = {
    ...reader,
    avatar: null,
    books: reader.books.map((b) => ({ ...b, cover: sampleCover(b) })),
    followers: reader.followers + (isFollowing ? 1 : 0),
    following: reader.followingN,
    isSelf: false,
    likePrefix: reader.id,
    show: { favs: true, recs: true, read: true, reviews: true },
  };

  return (
    <ProfileView
      profile={profile}
      onBack={() => navigate("/social")}
      onMessage={() => navigate(`/messages/${reader.id}`)}
      isFollowing={isFollowing}
      onToggleFollow={() => toggleFollow(reader.id)}
    />
  );
}

function EditProfile() {
  const { user, signOut, updateProfile, updateSharingSettings } = useAuth();
  const journal = useJournal();
  const { theme, setTheme } = useTheme();
  const { pickImage, notify } = useShell();
  const [name, setName] = useState(user.displayName);
  const [copied, setCopied] = useState(false);
  const p = journal.profile;
  const vis = user.profileVisibility;

  useEffect(() => setName(user.displayName), [user.displayName]);

  const saveName = () => {
    const n = name.trim();
    if (n && n !== user.displayName) updateProfile({ displayName: n }).catch((e) => notify(e.message));
  };

  // isPublic / favorites / ratings are stored in Supabase (they drive the
  // shareable page); "books read" and "recommendations" are on-device.
  const sharing = (patch) =>
    updateSharingSettings({
      isProfilePublic: patch.isProfilePublic ?? user.isProfilePublic,
      profileVisibility: { ...vis, ...(patch.vis || {}) },
    }).catch((e) => notify(e.message));

  const toggles = [
    { label: "Public profile, anyone can find me", on: user.isProfilePublic, toggle: () => sharing({ isProfilePublic: !user.isProfilePublic }) },
    { label: "Show books I've read", on: p.vis.read !== false, toggle: () => journal.setProfile({ vis: { ...p.vis, read: p.vis.read === false } }) },
    { label: "Show favorites", on: vis.showFavorites, toggle: () => sharing({ vis: { showFavorites: !vis.showFavorites } }) },
    { label: "Show recommendations", on: p.vis.recs !== false, toggle: () => journal.setProfile({ vis: { ...p.vis, recs: p.vis.recs === false } }) },
    { label: "Show reviews and ratings", on: vis.showRatings, toggle: () => sharing({ vis: { showRatings: !vis.showRatings } }) },
  ];

  const shareUrl = user.isProfilePublic && user.shareSlug ? `${window.location.origin}/u/${user.shareSlug}` : null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20, alignItems: "flex-start" }}>
      <Card roomy style={{ flex: "1 1 320px" }}>
        <CardHeader title="Profile details" />
        <div className={styles.photoRow}>
          <button type="button" className={styles.photoButton} title="Change photo" onClick={() => pickImage("avatar")}>
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : initials(user.displayName)}
          </button>
          <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
            Click the photo to upload a new one, or drop an image on this page.
          </div>
        </div>
        <div className={styles.fields}>
          <Field label="Display name">
            <input className={controlStyles.input} value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName} />
          </Field>
          <Field label="Username">
            <input className={controlStyles.input} value={p.handle} onChange={(e) => journal.setProfile({ handle: e.target.value })} />
          </Field>
          <Field label="Bio">
            <textarea
              className={controlStyles.input}
              rows={3}
              value={p.bio}
              placeholder="What do you love to read?"
              onChange={(e) => journal.setProfile({ bio: e.target.value })}
            />
          </Field>
          <div className={styles.genreLabel}>
            Favorite genres
            <div className={styles.genreChips}>
              {PROFILE_GENRES.map((g) => {
                const on = p.genres.includes(g);
                return (
                  <Button
                    key={g}
                    variant="chip"
                    className={clsx(on && controlStyles.chipOn)}
                    aria-pressed={on}
                    onClick={() => journal.setProfile({ genres: on ? p.genres.filter((x) => x !== g) : [...p.genres, g] })}
                  >
                    {g}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card roomy>
          <CardHeader title="Public profile" />
          <div style={{ marginTop: 6 }}>
            {toggles.map((t) => (
              <ToggleRow key={t.label} label={t.label} on={t.on} onToggle={t.toggle} />
            ))}
          </div>
          {shareUrl && (
            <div className={styles.shareRow}>
              <span className={styles.shareUrl}>{shareUrl}</span>
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard?.writeText(shareUrl).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  })
                }
              >
                {copied ? "Copied" : "Copy link"}
              </Button>
            </div>
          )}
        </Card>
        <Card roomy>
          <CardHeader title="Theme" />
          <div className={styles.themeCards}>
            <button type="button" className={clsx(styles.themeCard, theme === "dark" && styles.themeOn)} onClick={() => setTheme("dark")}>
              <span className={styles.swatch} style={{ background: "linear-gradient(135deg,#241a40,#0f0b1d 60%,#e6c193 140%)" }} />
              Midnight Library
            </button>
            <button type="button" className={clsx(styles.themeCard, theme === "light" && styles.themeOn)} onClick={() => setTheme("light")}>
              <span className={styles.swatch} style={{ background: "linear-gradient(135deg,#fff,#efe9e6 60%,#a98378 140%)" }} />
              Parchment
            </button>
          </div>
          <div className={styles.soon}>More book-inspired themes coming soon</div>
          <Button variant="outline" onClick={signOut} style={{ marginTop: 16, width: "100%", padding: 11, fontSize: 13 }}>
            Sign out
          </Button>
        </Card>
      </div>
    </div>
  );
}
