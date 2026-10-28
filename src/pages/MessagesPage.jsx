import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { CardHeader } from "../components/ui/Card.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { Button, controlStyles } from "../components/ui/controls.jsx";
import { useJournal } from "../hooks/useJournal.js";
import { ONLINE, READERS } from "../data/community.js";
import { chatTime, initials } from "../utils/dates.js";
import styles from "./community.module.css";

export function MessagesPage() {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const { chats, unread, typing, markRead, sendMessage } = useJournal();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const msgsRef = useRef(null);
  const viewing = useRef(readerId);
  viewing.current = readerId;

  const reader = READERS.find((r) => r.id === readerId) ?? null;
  const thread = reader ? chats[reader.id] || [] : [];

  // Opening a conversation clears its unread count.
  useEffect(() => {
    if (readerId && unread[readerId]) markRead(readerId);
  }, [readerId, unread, markRead]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [thread.length, typing, readerId]);

  const q = query.trim().toLowerCase();
  const convos = READERS.filter((p) => !q || (p.name + " " + p.handle).toLowerCase().includes(q))
    .map((p) => {
      const ms = chats[p.id] || [];
      const last = ms[ms.length - 1];
      return { p, last, ts: last ? last.ts : 0, unread: unread[p.id] || 0 };
    })
    .sort((a, b) => b.ts - a.ts);

  const send = () => {
    const t = inputRef.current?.value.trim();
    if (!t || !reader) return;
    inputRef.current.value = "";
    sendMessage(reader.id, t, { isViewing: (id) => viewing.current === id });
  };

  const first = reader?.name.split(" ")[0];
  const status = reader ? (typing === reader.id ? "typing…" : ONLINE.includes(reader.id) ? "Online" : reader.handle) : "";

  return (
    <div className={styles.chat}>
      <section className={styles.list}>
        <div className={styles.listHead}>
          <CardHeader icon="people" title="Followers" aside={`${READERS.length} followers`} />
          <input
            className={controlStyles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search followers"
            aria-label="Search followers"
          />
        </div>
        <div className={styles.convos}>
          {convos.map(({ p, last, unread: n }) => (
            <Link key={p.id} to={`/messages/${p.id}`} className={clsx(styles.convo, readerId === p.id && styles.convoOn)}>
              <span className={styles.chatAvatar}>
                {initials(p.name)}
                {ONLINE.includes(p.id) && <span className={styles.online} />}
              </span>
              <span className={styles.convoText}>
                <span className={styles.convoLine}>
                  <span className={styles.convoName}>{p.name}</span>
                  <span className={styles.convoTime}>{last ? chatTime(last.ts) : ""}</span>
                </span>
                <span className={styles.convoLine} style={{ alignItems: "center" }}>
                  <span className={styles.convoLast}>{last ? (last.from === "me" ? "You: " : "") + last.text : "Say hello"}</span>
                  {n > 0 && <span className={styles.unread}>{n}</span>}
                </span>
              </span>
            </Link>
          ))}
          {!convos.length && <p style={{ margin: 0, padding: 16, fontSize: 13, color: "var(--muted)" }}>No followers match your search.</p>}
        </div>
      </section>

      <section className={styles.thread}>
        {reader ? (
          <>
            <div className={styles.threadHead}>
              <button type="button" className={styles.backButton} title="Back" aria-label="Back" onClick={() => navigate("/messages")}>
                <Icon name="left" size={20} stroke="currentColor" />
              </button>
              <span className={styles.chatAvatar} style={{ width: 40, height: 40, fontSize: 13.5 }}>
                {initials(reader.name)}
              </span>
              <span className={styles.threadWho}>
                <span>{reader.name}</span>
                <span>{status}</span>
              </span>
              <Button variant="outline" onClick={() => navigate(`/readers/${reader.id}`)}>
                View profile
              </Button>
            </div>
            <div ref={msgsRef} className={styles.msgs}>
              {thread.map((m, i) => (
                <div key={i} className={m.from === "me" ? styles.mine : styles.theirs}>
                  <div className={styles.bubble}>{m.text}</div>
                  <span className={styles.time}>{chatTime(m.ts)}</span>
                </div>
              ))}
              {typing === reader.id && <div className={styles.typing}>{first} is typing…</div>}
              {!thread.length && <div className={styles.threadEmpty}>Say hello to {first} and ask what they're reading.</div>}
            </div>
            <div className={styles.composer}>
              <input
                ref={inputRef}
                className={controlStyles.input}
                placeholder="Write a message"
                aria-label="Write a message"
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button type="button" className={styles.send} title="Send" aria-label="Send" onClick={send}>
                <Icon name="send" size={18} stroke="currentColor" />
              </button>
            </div>
          </>
        ) : (
          <div className={styles.noThread}>
            <Icon name="chat" size={34} />
            <strong>Your messages</strong>
            Pick a follower to start a conversation.
          </div>
        )}
      </section>
    </div>
  );
}
