import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { REPLIES, seedChats, seedPosts } from "../data/community.js";
import { dayKey } from "../utils/dates.js";

// Everything the reading journal tracks that Supabase has no columns for:
// per-book progress/review/quotes/recommend, the reading log, challenges,
// profile extras, settings, and the (sample) community — persisted per
// signed-in reader in localStorage.

export const JournalContext = createContext(null);

const defaultSettings = () => ({
  startCollapsed: false,
  pauseVideo: false,
  notif: { followers: true, msgs: true, likes: false, releases: true },
});

const sampleCommunity = () => ({
  following: [],
  likes: {},
  chats: seedChats(),
  unread: { u2: 1, u3: 2 },
  posts: seedPosts(),
  postLikes: {},
});

function seedJournal(user) {
  return {
    books: {},
    logs: [],
    challenges: [{ id: 1, name: "Books this year", goal: 50, count: 0, auto: true }],
    profile: {
      handle: "@" + (user?.email?.split("@")[0] ?? "reader"),
      bio: "",
      genres: [],
      vis: { read: true, recs: true },
    },
    settings: defaultSettings(),
    ...sampleCommunity(),
  };
}

const storageKey = (userId) => `shelved.journal.${userId}`;

function load(user) {
  const seed = seedJournal(user);
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(user.id)) || "null");
    if (!saved) return seed;
    return {
      ...seed,
      ...saved,
      profile: { ...seed.profile, ...(saved.profile || {}), vis: { ...seed.profile.vis, ...((saved.profile || {}).vis || {}) } },
      settings: {
        ...seed.settings,
        ...(saved.settings || {}),
        notif: { ...seed.settings.notif, ...((saved.settings || {}).notif || {}) },
      },
    };
  } catch {
    return seed;
  }
}

export function JournalProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState(() => ({ userId, data: user ? load(user) : null }));
  const [typing, setTyping] = useState(null);
  const timers = useRef([]);

  // A different reader signed in (or out): load their journal during this
  // render, so nothing below ever sees a signed-in user without a journal.
  if (state.userId !== userId) setState({ userId, data: user ? load(user) : null });
  const journal = state.userId === userId ? state.data : null;

  useEffect(() => {
    if (!state.userId || !state.data) return;
    try {
      localStorage.setItem(storageKey(state.userId), JSON.stringify(state.data));
    } catch {
      // Storage full or blocked: the session keeps working in memory.
    }
  }, [state]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const update = useCallback(
    (fn) => setState((s) => (s.data ? { ...s, data: { ...s.data, ...fn(s.data) } } : s)),
    []
  );

  const patchBook = useCallback(
    (bookId, patch) => update((j) => ({ books: { ...j.books, [bookId]: { ...(j.books[bookId] || {}), ...patch } } })),
    [update]
  );

  const actions = useMemo(
    () => ({
      patchBook,
      forgetBook: (bookId) =>
        update((j) => {
          const books = { ...j.books };
          delete books[bookId];
          return { books, logs: j.logs.filter((l) => l.bookId !== bookId) };
        }),
      addLog: (bookId, pages) => update((j) => ({ logs: [...j.logs, { date: dayKey(0), bookId, pages }] })),
      removeLog: (index) => update((j) => ({ logs: j.logs.filter((_, i) => i !== index) })),
      addChallenge: (name, goal) =>
        update((j) => ({ challenges: [...j.challenges, { id: Date.now(), name, goal, count: 0, auto: false }] })),
      bumpChallenge: (id, delta) =>
        update((j) => ({
          challenges: j.challenges.map((c) => (c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c)),
        })),
      removeChallenge: (id) => update((j) => ({ challenges: j.challenges.filter((c) => c.id !== id) })),
      setProfile: (patch) => update((j) => ({ profile: { ...j.profile, ...patch } })),
      setSettings: (patch) => update((j) => ({ settings: { ...j.settings, ...patch } })),
      toggleFollow: (id) =>
        update((j) => ({
          following: j.following.includes(id) ? j.following.filter((x) => x !== id) : [...j.following, id],
        })),
      toggleLike: (key) => update((j) => ({ likes: { ...j.likes, [key]: !j.likes[key] } })),
      togglePostLike: (id) => update((j) => ({ postLikes: { ...j.postLikes, [id]: !j.postLikes[id] } })),
      markRead: (id) => update((j) => ({ unread: { ...j.unread, [id]: 0 } })),
      publishPost: (post) => update((j) => ({ posts: [post, ...j.posts] })),
      // Sends a message, then simulates the other reader typing and replying.
      sendMessage: (id, text, { isViewing }) => {
        update((j) => ({ chats: { ...j.chats, [id]: [...(j.chats[id] || []), { from: "me", ts: Date.now(), text }] } }));
        timers.current.forEach(clearTimeout);
        timers.current = [
          setTimeout(() => setTyping(id), 600),
          setTimeout(() => {
            const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
            setTyping(null);
            update((j) => ({
              chats: { ...j.chats, [id]: [...(j.chats[id] || []), { from: "them", ts: Date.now(), text: reply }] },
              unread: isViewing(id) ? j.unread : { ...j.unread, [id]: (j.unread[id] || 0) + 1 },
            }));
          }, 2200),
        ];
      },
      resetSample: () => update(() => sampleCommunity()),
    }),
    [patchBook, update]
  );

  const value = useMemo(() => (journal ? { ...journal, typing, ...actions } : null), [journal, typing, actions]);

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}
