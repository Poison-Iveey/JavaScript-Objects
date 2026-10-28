import { useRef } from "react";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Button, controlStyles } from "../components/ui/controls.jsx";
import { useShell } from "../components/layout/ShellContext.jsx";
import { useJournal } from "../hooks/useJournal.js";
import { useLibrary } from "../hooks/useLibrary.js";
import { logOptions, useStreak, useWeek } from "../hooks/useReadingStats.js";
import { formatDayKey } from "../utils/dates.js";
import styles from "./pages.module.css";

export function ReadingLogPage() {
  const { books, logPages } = useLibrary();
  const { logs, removeLog } = useJournal();
  const { notify } = useShell();
  const week = useWeek();
  const streak = useStreak();
  const bookRef = useRef(null);
  const pagesRef = useRef(null);

  const save = () => {
    const id = bookRef.current?.value;
    const p = parseInt(pagesRef.current?.value, 10);
    if (!id || !p) return;
    pagesRef.current.value = "";
    logPages(id, p).catch((e) => notify(e.message));
  };

  const stats = [
    { n: week.reduce((a, w) => a + w.v, 0), l: "Pages this week" },
    { n: logs.length, l: "Entries logged" },
    { n: streak, l: streak === 1 ? "Day streak" : "Days in a row" },
  ];

  return (
    <div className={styles.stack}>
      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </div>
      <Card roomy>
        <CardHeader icon="log" title="All entries" />
        <div className={styles.formRowSpaced}>
          <select ref={bookRef} className={controlStyles.input} style={{ flex: "1 1 200px", width: "auto" }} aria-label="Book">
            {logOptions(books).map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </select>
          <input
            ref={pagesRef}
            type="number"
            min="1"
            placeholder="Pages read today"
            className={controlStyles.input}
            style={{ flex: "0 1 160px", width: "auto" }}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
          <Button onClick={save}>Log pages</Button>
        </div>
        <div className={styles.logTable}>
          <div className={styles.logHead}>
            <span>Date</span>
            <span>Book</span>
            <span>Pages</span>
            <span />
          </div>
          {logs
            .map((l, i) => ({ l, i }))
            .reverse()
            .map(({ l, i }) => (
              <div key={i} className={styles.logRow}>
                <span>{formatDayKey(l.date)}</span>
                <span className={styles.ellipsis}>{books.find((b) => b.id === l.bookId)?.title ?? "—"}</span>
                <span>{l.pages}</span>
                <button type="button" className={styles.x} title="Delete entry" aria-label="Delete entry" onClick={() => removeLog(i)}>
                  ×
                </button>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
