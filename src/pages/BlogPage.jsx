import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Card } from "../components/ui/Card.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { Button, controlStyles } from "../components/ui/controls.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useJournal } from "../hooks/useJournal.js";
import { BLOG_TAGS } from "../data/community.js";
import { generatedCover } from "../utils/covers.js";
import styles from "./community.module.css";

const postCover = (p) => generatedCover({ cov: p.cov, text: "✦" });
const postMeta = (p) =>
  `${p.author} · ${new Date(p.ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${p.mins} min read`;

export function BlogPage() {
  const { postId } = useParams();
  const { posts } = useJournal();
  const post = postId ? posts.find((p) => String(p.id) === postId) : null;
  return post ? <Article post={post} /> : <PostList />;
}

function PostList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, publishPost } = useJournal();
  const [tag, setTag] = useState("All");
  const [composing, setComposing] = useState(false);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const shown = posts.filter((p) => tag === "All" || p.tag === tag);

  const publish = () => {
    const title = titleRef.current?.value.trim();
    const body = bodyRef.current?.value.trim();
    if (!title || !body) return;
    const id = Date.now();
    publishPost({
      id,
      uid: "me",
      author: user.displayName,
      tag: "Reading life",
      cov: id % 6,
      ts: id,
      mins: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
      title,
      paras: body.split(/\n+/).filter(Boolean),
    });
    setComposing(false);
    setTag("All");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 22 }}>
      <div className={styles.blogBar}>
        <div className={styles.tags}>
          {BLOG_TAGS.map((t) => (
            <button key={t} type="button" className={clsx(styles.tag, tag === t && styles.tagOn)} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
        <Button style={{ padding: "10px 16px", borderRadius: 9, fontSize: 13 }} onClick={() => setComposing((c) => !c)}>
          {composing ? "Close editor" : "+ Write a post"}
        </Button>
      </div>

      {composing && (
        <Card roomy className={styles.compose}>
          <input ref={titleRef} className={`${controlStyles.input} ${styles.postTitle}`} placeholder="Post title" aria-label="Post title" />
          <textarea ref={bodyRef} className={controlStyles.input} rows={6} placeholder="Write about a book, a reading habit, a list…" />
          <div className={styles.composeActions}>
            <Button variant="outline" onClick={() => setComposing(false)}>
              Cancel
            </Button>
            <Button style={{ padding: "10px 16px", borderRadius: 9, fontSize: 13 }} onClick={publish}>
              Publish
            </Button>
          </div>
        </Card>
      )}

      <div className={styles.posts}>
        {shown.map((p) => (
          <button key={p.id} type="button" className={styles.post} onClick={() => navigate(`/blog/${p.id}`)}>
            <img src={postCover(p)} alt="" />
            <span className={styles.postText}>
              <span className={styles.postTag}>{p.tag}</span>
              <span className={styles.postTitleCard}>{p.title}</span>
              <span className={styles.excerpt}>{p.paras[0].length > 140 ? p.paras[0].slice(0, 137).trim() + "…" : p.paras[0]}</span>
              <span className={styles.postMeta}>{postMeta(p)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Article({ post }) {
  const navigate = useNavigate();
  const { postLikes, togglePostLike } = useJournal();
  const liked = !!postLikes[post.id];
  const likes = ((post.title.length * 3) % 30) + (liked ? 1 : 0);
  const hasAuthor = !!post.uid && post.uid !== "me";

  return (
    <article className={styles.article}>
      <button type="button" className={styles.allPosts} onClick={() => navigate("/blog")}>
        <Icon name="left" size={16} stroke="currentColor" />
        All posts
      </button>
      <span className={styles.postTag} style={{ fontSize: 11 }}>
        {post.tag}
      </span>
      <h3>{post.title}</h3>
      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{postMeta(post)}</span>
      <img src={postCover(post)} alt="" />
      {post.paras.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      <div className={styles.articleActions}>
        <Button variant="outline" aria-pressed={liked} onClick={() => togglePostLike(post.id)}>
          {(liked ? "♥ Liked · " : "♡ Like · ") + likes}
        </Button>
        {hasAuthor && (
          <Button variant="outline" onClick={() => navigate(`/readers/${post.uid}`)}>
            View {post.author.split(" ")[0]}'s profile
          </Button>
        )}
      </div>
    </article>
  );
}
