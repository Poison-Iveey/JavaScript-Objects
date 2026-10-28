// "YYYY-MM-DD" for today minus `offset` days (local time).
export function dayKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// "YYYY-MM-DD" → "MM/DD/YYYY"
export function formatDayKey(key) {
  const [y, m, d] = key.split("-");
  return `${m}/${d}/${y}`;
}

// Time today, else the weekday.
export function chatTime(ts) {
  const d = new Date(ts);
  const n = new Date();
  if (d.toDateString() === n.toDateString()) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function greeting(name) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${part}, ${(name || "").split(" ")[0] || "reader"}`;
}
