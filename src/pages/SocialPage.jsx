import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Button, UnderlineTabs, controlStyles } from "../components/ui/controls.jsx";
import { ReviewRow, sampleCover } from "../components/profile/ProfileView.jsx";
import { useJournal } from "../hooks/useJournal.js";
import { READERS } from "../data/community.js";
import { initials } from "../utils/dates.js";
import styles from "./community.module.css";
import pageStyles from "./pages.module.css";

export function SocialPage() {
  const navigate = useNavigate();
  const { following, toggleFollow } = useJournal();
  const [tab, setTab] = useState("discover");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const people = READERS.filter(
    (p) =>
      (tab === "discover" || following.includes(p.id)) &&
      (!q || (p.name + " " + p.handle + " " + p.genres.join(" ")).toLowerCase().includes(q))
  );
  const feedUsers = following.length ? READERS.filter((p) => following.includes(p.id)) : READERS;
  const feed = feedUsers.flatMap((p) => p.books.filter((b) => b.review).map((b) => ({ p, b }))).slice(0, 6);

  return (
    <div className={pageStyles.stack}>
      <Card roomy>
        <div className={styles.socialHead}>
          <div style={{ flex: "1 1 auto" }}>
            <UnderlineTabs
              large
              items={[
                { value: "discover", label: "Discover" },
                { value: "following", label: `Following · ${following.length}` },
              ]}
              value={tab}
              onChange={setTab}
            />
          </div>
          <input
            className={controlStyles.input}
            style={{ flex: "0 1 300px", width: "auto" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search readers by name, handle or genre"
            aria-label="Search readers"
          />
        </div>
        <div className={styles.people}>
          {people.map((p) => {
            const isF = following.includes(p.id);
            return (
              <div key={p.id} className={styles.person} onClick={() => navigate(`/readers/${p.id}`)}>
                <div className={styles.personHead}>
                  <span className={styles.chatAvatar} style={{ width: 46, height: 46, background: "var(--nav-active)", border: 0, fontSize: 16 }}>
                    {initials(p.name)}
                  </span>
                  <span className={styles.personName}>
                    <span>{p.name}</span>
                    <span>{p.handle}</span>
                  </span>
                </div>
                <div className={styles.personBio}>{p.bio}</div>
                <div className={styles.covers}>
                  {p.books.slice(0, 4).map((b) => (
                    <img key={b.title} src={sampleCover(b)} alt="" />
                  ))}
                </div>
                <div className={styles.meta}>
                  {p.books.length} books · {p.books.filter((b) => b.review).length} reviews · {p.genres.join(", ")}
                </div>
                <div style={{ display: "flex" }}>
                  <Button
                    variant={isF ? "outline" : "primary"}
                    style={isF ? { padding: "8px 16px", borderRadius: 8 } : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(p.id);
                    }}
                  >
                    {isF ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {!people.length && (
          <p className={pageStyles.muted}>
            {tab === "following" && !following.length ? "You're not following anyone yet." : "No readers match your search."}
          </p>
        )}
      </Card>

      <Card roomy>
        <CardHeader icon="people" title="Recent activity" aside={following.length ? "From readers you follow" : "Popular with readers"} />
        {feed.map(({ p, b }) => (
          <ReviewRow
            key={p.id + b.title}
            cover={sampleCover(b)}
            title={b.title}
            author={b.author}
            rating={b.rating}
            review={b.review}
            likeKey={`${p.id}-${b.title}`}
            actor={`${p.name} reviewed`}
            onActor={() => navigate(`/readers/${p.id}`)}
          />
        ))}
      </Card>
    </div>
  );
}
