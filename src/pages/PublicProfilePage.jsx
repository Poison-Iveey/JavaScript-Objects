import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookMarked } from "lucide-react";
import * as authService from "../services/authService.js";
import * as booksService from "../services/booksService.js";
import { PublicBookCard } from "../components/books/PublicBookCard.jsx";
import styles from "./PublicProfilePage.module.css";

export function PublicProfilePage() {
  const { shareSlug } = useParams();
  const [status, setStatus] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    let cancelled = false;

    authService.getUserByShareSlug(shareSlug).then(async (foundProfile) => {
      if (cancelled) return;
      if (!foundProfile) {
        setStatus("not-found");
        return;
      }
      const publicBooks = await booksService.getPublicBooks(foundProfile.id, foundProfile.profileVisibility);
      if (cancelled) return;
      setProfile(foundProfile);
      setBooks(publicBooks);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [shareSlug]);

  if (status === "loading") return null;

  if (status === "not-found") {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <BookMarked size={32} strokeWidth={1.5} />
          <p>This profile is private or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{profile.displayName[0]}</div>
        )}
        <h1 className={styles.title}>{profile.displayName}'s Shelf</h1>
        <p className={styles.subtitle}>{books.length} book{books.length === 1 ? "" : "s"}</p>
      </header>

      {books.length === 0 ? (
        <p className={styles.empty}>Nothing on this shelf yet.</p>
      ) : (
        <div className={styles.grid}>
          {books.map((book) => (
            <PublicBookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
