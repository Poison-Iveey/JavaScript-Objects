import { useJournal } from "./useJournal.js";
import { dayKey } from "../utils/dates.js";

// Pages logged on each of the last seven days, oldest first.
export function useWeek() {
  const { logs } = useJournal();
  return [6, 5, 4, 3, 2, 1, 0].map((o) => {
    const date = dayKey(o);
    const d = new Date();
    d.setDate(d.getDate() - o);
    return {
      date,
      lbl: d.toLocaleDateString("en-US", { weekday: "short" }),
      v: logs.filter((l) => l.date === date).reduce((a, l) => a + l.pages, 0),
    };
  });
}

// Consecutive days (ending today) with at least one log entry.
export function useStreak() {
  const { logs } = useJournal();
  let streak = 0;
  while (logs.some((l) => l.date === dayKey(streak))) streak++;
  return streak;
}

// Books to log pages against: in-progress and finished first, wishlist last.
export function logOptions(books) {
  return books
    .filter((b) => b.status !== "want")
    .concat(books.filter((b) => b.status === "want"))
    .map((b) => ({ id: b.id, title: b.title }));
}
