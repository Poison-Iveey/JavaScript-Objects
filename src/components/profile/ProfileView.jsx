import { Card, CardHeader } from "../ui/Card.jsx";
import { Icon } from "../ui/Icon.jsx";
import { Button, Stars } from "../ui/controls.jsx";
import { MiniBook, tileStyles } from "../books/BookTile.jsx";
import { useJournal } from "../../hooks/useJournal.js";
import { coverIndex, generatedCover } from "../../utils/covers.js";
import { initials } from "../../utils/dates.js";
import styles from "./profile.module.css";

// Cover for a sample reader's book (they have no uploads).
export const sampleCover = (b) => generatedCover({ cov: b.cov ?? coverIndex(b.title), text: b.title });

export function ReviewRow({ cover, title, author, rating, review, likeKey, actor, onActor }) {
  const { likes, toggleLike } = useJournal();
  const liked = !!likes[likeKey];
  const count = ((title.length * 7) % 40) + (liked ? 1 : 0);
  return (
    <div className={styles.review}>
      <img src={cover} alt="" />
      <div className={styles.reviewBody}>
        {actor && (
          <button type="button" className={styles.actor} onClick={onActor}>
            {actor}
          </button>
        )}
        <span className={styles.reviewTitle}>
          {title} <span>· {author}</span>
        </span>
        <Stars rating={rating} />
        <p className={styles.reviewText}>{review}</p>
        <button type="button" className={styles.like} aria-pressed={liked} onClick={() => toggleLike(likeKey)}>
          <Icon
            name="heart"
            size={15}
            strokeWidth={1.6}
            stroke={liked ? "var(--ring1)" : "currentColor"}
            fill={liked ? "var(--ring1)" : "none"}
          />
          {count}
        </button>
      </div>
    </div>
  );
}

function Shelf({ title, books, empty }) {
  return (
    <Card roomy>
      <CardHeader title={title} />
      <div className={tileStyles.miniGrid}>
        {books.map((b, i) => (
          <MiniBook key={i} cover={b.cover} title={b.title} onOpen={b.open} />
        ))}
      </div>
      {!books.length && <p className={styles.emptyNote}>{empty}</p>}
    </Card>
  );
}

// A reader's public page. `profile` is already normalised:
// { name, handle, bio, genres, avatar, books[{cover,title,author,rating,review,fav,rec,status,open}],
//   followers, following, isSelf, show: {favs,recs,read,reviews}, privateNote, likePrefix }
export function ProfileView({ profile, onBack, onMessage, isFollowing, onToggleFollow, onEdit }) {
  const favs = profile.books.filter((b) => b.fav);
  const recs = profile.books.filter((b) => b.rec);
  const reads = profile.books.filter((b) => b.status === "read");
  const reviews = profile.books.filter((b) => (b.review || "").trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack}>
          ← Back to Social
        </button>
      )}
      {profile.privateNote && <div className={styles.privateNote}>Your profile is private. Only you can see this page.</div>}

      <Card roomy className={styles.hero}>
        <span className={styles.avatar}>{profile.avatar ? <img src={profile.avatar} alt="" /> : initials(profile.name)}</span>
        <div className={styles.who}>
          <span className={styles.name}>{profile.name}</span>
          <span className={styles.handle}>{profile.handle}</span>
          <p className={styles.bio}>{profile.bio}</p>
          <div className={styles.genres}>
            {profile.genres.map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        </div>
        <div className={styles.stats}>
          {[
            { n: reads.length, l: "Books read" },
            { n: reviews.length, l: "Reviews" },
            { n: profile.followers, l: "Followers" },
            { n: profile.following, l: "Following" },
          ].map((s) => (
            <div key={s.l} className={styles.stat}>
              <span>{s.n}</span>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          {profile.isSelf ? (
            <Button variant="outline" onClick={onEdit} style={{ padding: "8px 16px", borderRadius: 8 }}>
              Edit profile
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onMessage}>
                Message
              </Button>
              {isFollowing ? (
                <Button variant="outline" onClick={onToggleFollow} style={{ padding: "8px 16px", borderRadius: 8 }}>
                  Following
                </Button>
              ) : (
                <Button onClick={onToggleFollow}>Follow</Button>
              )}
            </>
          )}
        </div>
      </Card>

      {profile.show.favs && <Shelf title="Favorites" books={favs} empty="No favorites yet. Tap the heart on a book to add one." />}
      {profile.show.recs && <Shelf title="Recommends" books={recs} empty="No recommendations yet." />}
      {profile.show.read && <Shelf title="Books read" books={reads} empty="No finished books yet." />}
      {profile.show.reviews && (
        <Card roomy>
          <CardHeader title="Reviews & ratings" />
          {reviews.map((b, i) => (
            <ReviewRow
              key={i}
              cover={b.cover}
              title={b.title}
              author={b.author}
              rating={b.rating}
              review={b.review}
              likeKey={`${profile.likePrefix}-${b.title}`}
            />
          ))}
          {!reviews.length && <p className={styles.emptyNote} style={{ marginTop: 12 }}>No reviews yet.</p>}
        </Card>
      )}
    </div>
  );
}
