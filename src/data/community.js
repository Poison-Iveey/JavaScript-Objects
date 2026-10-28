// Sample community content (readers, conversations, blog posts, upcoming
// releases). There's no backend for these yet — they live in each reader's
// on-device journal, seeded from here, exactly as in the design template.

export const STATUSES = [
  { value: "want", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
];

export const SHELF_TABS = [
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
  { value: "want", label: "Want to read" },
  { value: "all", label: "All" },
];

export const PROFILE_GENRES = [
  "Classics",
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Mystery",
  "Historical",
  "Poetry",
  "Non-fiction",
  "African Literature",
  "Horror",
];

// Day of month → [title, color]. Sample until a releases API is connected.
export const RELEASES = {
  4: ["The Silent Tide", "#5a3d8a"],
  5: ["Ember & Ash", "#6b5240"],
  8: ["Atlas of Dreams", "#6a4aa8"],
  11: ["House of Quills", "#5a3d8a"],
  15: ["The Moonlit Archive", "#5a3d8a"],
  18: ["The Last Cartographer", "#4a3580"],
  24: ["Salt & Starlight", "#8a6448"],
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const bk = (title, author, cov, rating, review, fav, rec) => ({
  title,
  author,
  cov,
  rating,
  review: review || "",
  fav: !!fav,
  rec: !!rec,
  status: "read",
});

export const READERS = [
  {
    id: "u1",
    name: "Amara Okafor",
    handle: "@amarareads",
    bio: "Lagos. African literature, slow mornings and long novels.",
    genres: ["African Literature", "Historical"],
    followers: 214,
    followingN: 88,
    books: [
      bk("Half of a Yellow Sun", "Chimamanda Ngozi Adichie", 4, 5, "Devastating and tender. Olanna and Odenigbo stayed with me for weeks.", 1, 1),
      bk("Homegoing", "Yaa Gyasi", 5, 5, "Each chapter is a whole life. I read it in two sittings.", 0, 1),
      bk("The Famished Road", "Ben Okri", 2, 4),
      bk("Things Fall Apart", "Chinua Achebe", 0, 5, "", 1),
    ],
  },
  {
    id: "u2",
    name: "Leo Marchetti",
    handle: "@leoturnspages",
    bio: "Sci-fi and anything with a map in the front.",
    genres: ["Sci-Fi", "Fantasy"],
    followers: 98,
    followingN: 41,
    books: [
      bk("Hyperion", "Dan Simmons", 1, 5, "The Canterbury Tales in space, and it works.", 1),
      bk("The Left Hand of Darkness", "Ursula K. Le Guin", 3, 5, "Quiet, cold and very human.", 0, 1),
      bk("Dune", "Frank Herbert", 1, 4),
    ],
  },
  {
    id: "u3",
    name: "Hana Sato",
    handle: "@hanareads",
    bio: "Mysteries, poetry, and re-reading Austen every winter.",
    genres: ["Mystery", "Poetry", "Classics"],
    followers: 330,
    followingN: 120,
    books: [
      bk("Persuasion", "Jane Austen", 0, 5, "The letter scene. That's the review.", 1, 1),
      bk("The Secret History", "Donna Tartt", 2, 4, "Atmospheric. I wanted more of the aftermath."),
      bk("Rebecca", "Daphne du Maurier", 3, 4, "", 1),
    ],
  },
  {
    id: "u4",
    name: "Kwame Mensah",
    handle: "@kwamebooks",
    bio: "Non-fiction, essays, and the occasional thriller.",
    genres: ["Non-fiction", "African Literature"],
    followers: 57,
    followingN: 63,
    books: [
      bk("Born a Crime", "Trevor Noah", 5, 5, "Funny until it isn't. Brilliant on audio.", 0, 1),
      bk("The Beautiful Things That Heaven Bears", "Dinaw Mengestu", 4, 4),
      bk("Sapiens", "Yuval Noah Harari", 1, 3, "Big ideas, some overreach."),
    ],
  },
];

export const ONLINE = ["u1", "u3"];

export const REPLIES = [
  "Ha, same here.",
  "Ooh, adding that to my wishlist.",
  "Tell me what you think when you finish it.",
  "That's exactly how I felt about it.",
  "Good question. Let me think and get back to you.",
];

export const BLOG_TAGS = ["All", "Reading life", "Lists", "Opinion", "Updates"];

const minutesAgo = (m) => Date.now() - m * 60000;

export function seedChats() {
  return {
    u1: [
      ["them", 1500, "Have you started Homegoing yet? I think you'd love the Effia chapters."],
      ["me", 1490, "Not yet, it's next after Wuthering Heights."],
      ["them", 1485, "Perfect. Tell me when you get to Marjorie's part."],
    ].map(([from, m, text]) => ({ from, ts: minutesAgo(m), text })),
    u2: [{ from: "them", ts: minutesAgo(40), text: "Saw you're reading Dune. How far in are you?" }],
    u3: [
      { from: "them", ts: minutesAgo(300), text: "I'm starting a Persuasion re-read in December if you want to join." },
      { from: "them", ts: minutesAgo(298), text: "No pressure, it's very low-key." },
    ],
    u4: [],
  };
}

const POSTS = [
  {
    id: 1,
    uid: "u3",
    author: "Hana Sato",
    tag: "Reading life",
    cov: 0,
    days: 2,
    mins: 4,
    title: "How I keep a reading journal without it becoming homework",
    paras: [
      "For years I started reading journals in January and abandoned them by March. The problem was that I treated every entry like a book report.",
      "Now I write three things after each reading session: the page I stopped on, one line that stayed with me, and a single word for how the book felt that day. It takes a minute, and over a month it turns into a surprisingly honest record.",
      "When I finish a book I go back through those notes before writing a review. The review is better for it, because I remember how the middle felt and not only the ending.",
    ],
  },
  {
    id: 2,
    uid: "u1",
    author: "Amara Okafor",
    tag: "Lists",
    cov: 1,
    days: 5,
    mins: 3,
    title: "Five African novels I keep recommending",
    paras: [
      "Whenever someone asks where to begin with African literature, I give the same five books: Things Fall Apart, Half of a Yellow Sun, Homegoing, The Famished Road and Nervous Conditions.",
      "They span different countries, decades and styles, from Achebe's spare prose to Okri's dreamlike Lagos. Read them in any order, but read Achebe first if you can; so much of what came after is in conversation with him.",
      "All five are on my public shelf with my notes, if you want to compare impressions.",
    ],
  },
  {
    id: 3,
    uid: "u2",
    author: "Leo Marchetti",
    tag: "Opinion",
    cov: 3,
    days: 9,
    mins: 2,
    title: "Why I stopped finishing books I don't enjoy",
    paras: [
      "I used to finish every book out of stubbornness. Last year I gave myself permission to stop at page 100 if I wasn't enjoying it, and I read more than ever.",
      "Stopping isn't failure. I move those books back to Want to read with a short note on why I paused, and a few of them have worked the second time around.",
    ],
  },
  {
    id: 4,
    uid: null,
    author: "Literary Journey",
    tag: "Updates",
    cov: 5,
    days: 12,
    mins: 1,
    title: "Messages are here",
    paras: [
      "You can now message the readers who follow you. Open Messages from the menu, pick a follower and start a conversation about what you're both reading.",
      "Messages are private between you and the other reader.",
    ],
  },
];

export function seedPosts() {
  return POSTS.map((p) => ({ ...p, ts: minutesAgo(p.days * 1440) }));
}

export const ABOUT_CARDS = [
  { icon: "shelf", title: "Catalogue your shelf", text: "Every book you've read in one place, with the covers you choose." },
  { icon: "quote", title: "Keep what moved you", text: "Ratings, reviews, notes and favorite quotes for each book." },
  { icon: "log", title: "Track your reading", text: "Log pages each day, see your weekly progress and set yearly goals." },
  { icon: "people", title: "Read with others", text: "Share a public profile, follow readers and message your followers." },
];
