import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Card, CardHeader } from "../ui/Card.jsx";
import { Icon } from "../ui/Icon.jsx";
import { Button, UnderlineTabs } from "../ui/controls.jsx";
import { BookTile } from "../books/BookTile.jsx";
import { ChallengeRing } from "./ChallengeRing.jsx";
import { useShell } from "../layout/ShellContext.jsx";
import { useJournal } from "../../hooks/useJournal.js";
import { useLibrary } from "../../hooks/useLibrary.js";
import { useWeek, logOptions } from "../../hooks/useReadingStats.js";
import { MONTHS, RELEASES, SHELF_TABS } from "../../data/community.js";
import { formatDayKey } from "../../utils/dates.js";
import styles from "./widgets.module.css";

export function shelfTabs(books) {
  return SHELF_TABS.map((t) => ({
    value: t.value,
    label: `${t.label} · ${t.value === "all" ? books.length : books.filter((b) => b.status === t.value).length}`,
  }));
}

export function LibraryWidget() {
  const { books } = useLibrary();
  const { openDetail } = useShell();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("reading");
  const shown = books.filter((b) => filter === "all" || b.status === filter).slice(0, 4);

  return (
    <Card>
      <CardHeader icon="open" title="My Library" aside="View all" onAside={() => navigate("/library")} />
      <div className={styles.tabsRow}>
        <UnderlineTabs items={shelfTabs(books)} value={filter} onChange={setFilter} />
      </div>
      <div className={styles.twoGrid}>
        {shown.map((b) => (
          <BookTile key={b.id} book={b} onOpen={openDetail} />
        ))}
      </div>
      {!shown.length && <div className={styles.empty}>No books here yet.</div>}
    </Card>
  );
}

export function ProgressChart() {
  const week = useWeek();
  const [hover, setHover] = useState(-1);
  const max = Math.max(10, Math.ceil(Math.max(...week.map((w) => w.v)) / 10) * 10);
  const info = hover >= 0 ? `${week[hover].lbl}: ${week[hover].v} pages` : `${week.reduce((a, w) => a + w.v, 0)} pages this week`;

  return (
    <Card>
      <CardHeader icon="pen" title="Reading Progress" />
      <div className={styles.chartHead}>
        <span>Pages Read · Last 7 Days</span>
        <span>{info}</span>
      </div>
      <div className={styles.chart}>
        <div className={styles.ticks}>
          {[1, 0.75, 0.5, 0.25, 0].map((f) => (
            <span key={f}>{Math.round(max * f)}</span>
          ))}
        </div>
        <div className={styles.plot}>
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
            <defs>
              <linearGradient id="lj-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: "var(--bar-a)" }} />
                <stop offset="1" style={{ stopColor: "var(--bar-b)" }} />
              </linearGradient>
              <linearGradient id="lj-hi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: "var(--hi-a)" }} />
                <stop offset="1" style={{ stopColor: "var(--hi-b)" }} />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.bars}>
            {week.map((w, i) => {
              const hv = (w.v / max) * 100;
              return (
                <div key={w.date} className={styles.bar} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}>
                  <svg viewBox="0 0 10 100" preserveAspectRatio="none">
                    <rect x="0" y={100 - hv} width="10" height={hv} fill={i === 6 ? "url(#lj-hi)" : "url(#lj-bar)"} />
                  </svg>
                </div>
              );
            })}
          </div>
          <div className={styles.barLabels}>
            {week.map((w) => (
              <span key={w.date}>{w.lbl}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function WeeklyLogWidget() {
  const { books, logPages } = useLibrary();
  const { logs } = useJournal();
  const { notify } = useShell();
  const [adding, setAdding] = useState(false);
  const bookRef = useRef(null);
  const pagesRef = useRef(null);
  const options = logOptions(books);

  const commit = () => {
    const id = bookRef.current?.value;
    const p = parseInt(pagesRef.current?.value, 10);
    setAdding(false);
    if (id && p) logPages(id, p).catch((e) => notify(e.message));
  };

  const start = () => {
    setAdding(true);
    setTimeout(() => pagesRef.current?.focus(), 0);
  };

  return (
    <Card id="sec-log">
      <CardHeader icon="calendarLog" title="Weekly Reading Log" />
      <div className={styles.table}>
        <div className={styles.thead}>
          <span>Date</span>
          <span>Book Title</span>
          <span>Pages</span>
        </div>
        {logs
          .slice(-5)
          .reverse()
          .map((l, i) => (
            <div key={i} className={styles.row}>
              <span>{formatDayKey(l.date)}</span>
              <span className={styles.ellipsis}>{books.find((b) => b.id === l.bookId)?.title ?? "—"}</span>
              <span>{l.pages}</span>
            </div>
          ))}
        {adding && (
          <div className={styles.inlineAdd}>
            <select ref={bookRef} aria-label="Book">
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
            <input
              ref={pagesRef}
              type="number"
              min="1"
              placeholder="Pages"
              aria-label="Pages"
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setAdding(false);
              }}
            />
          </div>
        )}
        <div className={styles.inlineButtons}>
          <Button variant="text" onClick={adding ? commit : start}>
            {adding ? "✓ Save entry" : "+ New"}
          </Button>
          {adding && (
            <Button variant="text" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function QuotesWidget() {
  const { books } = useLibrary();
  const { openDetail } = useShell();
  const quotes = books
    .flatMap((b) => b.quotes.map((t) => ({ text: t, book: b.title, id: b.id })))
    .slice(-2)
    .reverse();

  return (
    <Card variant="quote" id="sec-quotes">
      <CardHeader icon="quote" title="Favorite Quotes" />
      <div className={styles.quoteBody}>
        <div className={styles.bigQuote}>“</div>
        {quotes.map((q, i) => (
          <button key={i} type="button" className={styles.quoteButton} onClick={() => openDetail(q.id)}>
            <p>“{q.text}”</p>
            <div>— {q.book}</div>
          </button>
        ))}
        {!quotes.length && <p className={styles.noQuotes}>Open a book and save a line you love.</p>}
        <div className={styles.moonMark}>☾</div>
      </div>
    </Card>
  );
}

export function AddBookCard() {
  const { pickImage } = useShell();
  return (
    <button type="button" className={styles.dropCard} onClick={() => pickImage("new")}>
      <Icon name="upload" size={34} strokeWidth={1.4} />
      <span className={styles.dropTitle}>Add a book</span>
      <span className={styles.dropText}>Drop a cover image here, or anywhere on the page. Click to browse.</span>
    </button>
  );
}

export function ReleasesCalendar() {
  const [sel, setSel] = useState(null);
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const pdim = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push({ n: pdim - first + 1 + i, muted: true });
  for (let i = 1; i <= dim; i++) cells.push({ n: i });
  let nx = 1;
  while (cells.length % 7) cells.push({ n: nx++, muted: true });

  return (
    <Card>
      <CardHeader icon="calendar" title="Upcoming Releases" />
      <div className={styles.month}>
        {MONTHS[m]} {y}
      </div>
      <div className={styles.weekdays}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className={styles.days}>
        {cells.map((c, i) => {
          const rel = !c.muted && RELEASES[c.n];
          return (
            <div key={i} className={clsx(styles.day, !c.muted && sel === c.n && styles.daySel)}>
              <span className={c.muted ? styles.dayMuted : undefined}>{c.n}</span>
              {rel && (
                <button
                  type="button"
                  className={styles.rel}
                  title={rel[0]}
                  aria-label={`${MONTHS[m]} ${c.n}: ${rel[0]}`}
                  onClick={() => setSel(sel === c.n ? null : c.n)}
                >
                  ✦
                </button>
              )}
              {!c.muted && c.n === now.getDate() && <span className={styles.today} />}
            </div>
          );
        })}
      </div>
      <div className={styles.dayInfo}>
        {sel && RELEASES[sel]
          ? `${MONTHS[m].slice(0, 3)} ${sel} · ${RELEASES[sel][0]}`
          : "Tap a marked day to see the release. Sample data until the releases API is connected."}
      </div>
    </Card>
  );
}

export function ChallengesWidget() {
  const { challenges, addChallenge } = useJournal();
  const { books } = useLibrary();
  const [adding, setAdding] = useState(false);
  const nameRef = useRef(null);
  const goalRef = useRef(null);
  const readCount = books.filter((b) => b.status === "read").length;

  const commit = () => {
    const n = nameRef.current?.value.trim();
    const g = parseInt(goalRef.current?.value, 10);
    setAdding(false);
    if (n && g) addChallenge(n, g);
  };
  const keys = (e) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setAdding(false);
  };

  return (
    <Card id="sec-chal">
      <CardHeader icon="flag" title="Reading Challenges" />
      <div className={styles.rings}>
        {challenges.map((c, i) => (
          <ChallengeRing key={c.id} challenge={c} index={i} readCount={readCount} />
        ))}
        {adding && (
          <div className={styles.chalAdd}>
            <input ref={nameRef} placeholder="e.g. 12 classics" onKeyDown={keys} aria-label="Challenge name" />
            <input ref={goalRef} type="number" min="1" placeholder="Goal" onKeyDown={keys} aria-label="Goal" />
          </div>
        )}
        <Button
          variant="text"
          style={{ alignSelf: "flex-start", padding: "2px 4px" }}
          onClick={() => {
            if (adding) commit();
            else {
              setAdding(true);
              setTimeout(() => nameRef.current?.focus(), 0);
            }
          }}
        >
          {adding ? "✓ Save challenge" : "+ New challenge"}
        </Button>
      </div>
    </Card>
  );
}
