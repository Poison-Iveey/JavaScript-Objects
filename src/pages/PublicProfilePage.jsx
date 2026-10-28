import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Stars, ThemeButton } from "../components/ui/controls.jsx";
import { MiniBook, tileStyles } from "../components/books/BookTile.jsx";
import * as authService from "../services/authService.js";
import * as booksService from "../services/booksService.js";
import { coverIndex, generatedCover, whenCoverFontsReady } from "../utils/covers.js";
import { initials } from "../utils/dates.js";
import profileStyles from "../components/profile/profile.module.css";
import styles from "./AuthPage.module.css";

// The shareable /u/:slug page — visible to anyone while the owner's profile
// is public. Supabase's public views already hide whatever they chose not to share.
export function PublicProfilePage() {
  const { shareSlug } = useParams();
  const [status, setStatus] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [, setFonts] = useState(0);

  useEffect(() => {
    whenCoverFontsReady().then(() => setFonts((n) => n + 1));
  }, []);

  useEffect(() => {
    let cancelled = false;
    authService
      .getUserByShareSlug(shareSlug)
      .then(async (found) => {
        if (cancelled) return;
        if (!found) return setStatus("not-found");
        const publicBooks = await booksService.getPublicBooks(found.id);
        if (cancelled) return;
        setProfile(found);
        setBooks(publicBooks);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("not-found"));
    return () => {
      cancelled = true;
    };
  }, [shareSlug]);

  const cover = (b) => b.coverUrl || generatedCover({ cov: coverIndex(b.id), text: b.title });
  const favs = books.filter((b) => b.isFavorite);
  const reads = books.filter((b) => b.status === "read");
  const rated = books.filter((b) => b.rating);

  return (
    <div className={styles.page} style={{ alignItems: "flex-start" }}>
      <ThemeButton style={{ position: "absolute", top: 16, right: 16 }} />
      <div style={{ width: "100%", maxWidth: 920, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className={styles.crescent} aria-hidden="true">
          <span />
          <span>☾</span>
          <span />
        </div>
        <h1 className={styles.title}>Literary Journey</h1>

        {status === "loading" && <p className={styles.tagline}>Opening the shelf…</p>}
        {status === "not-found" && <p className={styles.tagline}>This profile is private or doesn't exist.</p>}

        {status === "ready" && (
          <>
            <Card roomy className={profileStyles.hero}>
              <span className={profileStyles.avatar}>
                {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : initials(profile.displayName)}
              </span>
              <div className={profileStyles.who}>
                <span className={profileStyles.name}>{profile.displayName}</span>
                <span className={profileStyles.handle}>{books.length} books on the shelf</span>
              </div>
              <div className={profileStyles.stats}>
                <div className={profileStyles.stat}>
                  <span>{reads.length}</span>
                  <span>Books read</span>
                </div>
                <div className={profileStyles.stat}>
                  <span>{favs.length}</span>
                  <span>Favorites</span>
                </div>
              </div>
            </Card>
            {favs.length > 0 && (
              <Card roomy>
                <CardHeader title="Favorites" />
                <div className={tileStyles.miniGrid}>
                  {favs.map((b) => (
                    <MiniBook key={b.id} cover={cover(b)} title={b.title} />
                  ))}
                </div>
              </Card>
            )}
            <Card roomy>
              <CardHeader title="Books read" />
              <div className={tileStyles.miniGrid}>
                {reads.map((b) => (
                  <MiniBook key={b.id} cover={cover(b)} title={b.title} />
                ))}
              </div>
              {!reads.length && <p className={profileStyles.emptyNote}>No finished books yet.</p>}
            </Card>
            {rated.length > 0 && (
              <Card roomy>
                <CardHeader title="Ratings" />
                {rated.map((b) => (
                  <div key={b.id} className={profileStyles.review}>
                    <img src={cover(b)} alt="" />
                    <div className={profileStyles.reviewBody}>
                      <span className={profileStyles.reviewTitle}>
                        {b.title} <span>· {b.author}</span>
                      </span>
                      <Stars rating={Math.min(5, b.rating)} />
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
