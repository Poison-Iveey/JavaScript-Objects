// Design-system entry for Claude Design (built by /design-sync).
// Re-exports Shelved's real components from src/ unchanged, plus
// ShelvedProvider: the auth / books / theme / router context those components
// read, backed by in-memory sample data instead of Supabase.

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MemoryRouter, useInRouterContext } from "react-router-dom";
import { MotionGlobalConfig } from "framer-motion";
import { AuthContext } from "../../src/context/AuthContext.jsx";
import { BooksContext } from "../../src/context/BooksContext.jsx";
import { ThemeContext } from "../../src/context/ThemeContext.jsx";
import "../../src/styles/global.css";

export { Button } from "../../src/components/ui/Button.jsx";
export { ConfirmDialog } from "../../src/components/ui/ConfirmDialog.jsx";
export { FormField, Input } from "../../src/components/ui/FormField.jsx";
export { GoogleIcon } from "../../src/components/ui/GoogleIcon.jsx";
export { IconButton } from "../../src/components/ui/IconButton.jsx";
export { Modal } from "../../src/components/ui/Modal.jsx";
export { ThemeToggle } from "../../src/components/ui/ThemeToggle.jsx";

export { AddBookPanel } from "../../src/components/books/AddBookPanel.jsx";
export { AddBookSheet } from "../../src/components/books/AddBookSheet.jsx";
export { BookCard } from "../../src/components/books/BookCard.jsx";
export { BookDetailSheet } from "../../src/components/books/BookDetailSheet.jsx";
export { BookGrid } from "../../src/components/books/BookGrid.jsx";
export { BookListView } from "../../src/components/books/BookListView.jsx";
export { CategoryIndexList } from "../../src/components/books/CategoryIndexList.jsx";
export { FileAttachInput } from "../../src/components/books/FileAttachInput.jsx";
export { PublicBookCard } from "../../src/components/books/PublicBookCard.jsx";
export { RatingControl } from "../../src/components/books/RatingControl.jsx";
export { SearchBar } from "../../src/components/books/SearchBar.jsx";
export { StatusControl } from "../../src/components/books/StatusControl.jsx";
export { UploadDropzone } from "../../src/components/books/UploadDropzone.jsx";

export { AppBackgroundScene } from "../../src/components/decor/AppBackgroundScene.jsx";
export { FallingLeaves } from "../../src/components/decor/FallingLeaves.jsx";
export { ParkScene } from "../../src/components/decor/ParkScene.jsx";

export { AppHeader } from "../../src/components/layout/AppHeader.jsx";
export { AppShell } from "../../src/components/layout/AppShell.jsx";
export { BottomNav } from "../../src/components/layout/BottomNav.jsx";
export { NavDrawer } from "../../src/components/layout/NavDrawer.jsx";
export { Sidebar } from "../../src/components/layout/Sidebar.jsx";

export { ShareLinkPanel } from "../../src/components/profile/ShareLinkPanel.jsx";
export { ShareProfileModal } from "../../src/components/profile/ShareProfileModal.jsx";
export {
  FacebookIcon,
  InstagramIcon,
  SubstackIcon,
  TikTokIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "../../src/components/profile/SocialIcons.jsx";

export { AvatarUploader } from "../../src/components/settings/AvatarUploader.jsx";
export { ProfileForm } from "../../src/components/settings/ProfileForm.jsx";
export { SharingSettings } from "../../src/components/settings/SharingSettings.jsx";

export { AuthForm } from "../../src/components/auth/AuthForm.jsx";

export { GENRES } from "../../src/data/genres.js";
export { NAV_ITEMS } from "../../src/config/navigation.js";

// Simple in-palette cover art so sample books don't all fall back to a letter.
const COVER_PALETTES = [
  ["#1c1830", "#42365f", "#d6b875"],
  ["#eadfdb", "#c9b2aa", "#2a2321"],
  ["#2c3b38", "#5f8a7e", "#f5f1ec"],
  ["#8c6e67", "#c9a99f", "#fbf9f6"],
  ["#100e1c", "#28223d", "#b9a0e8"],
  ["#5a3e3a", "#a3847c", "#f5f1ec"],
];

export function sampleCover(title, author, index = 0) {
  const [from, to, ink] = COVER_PALETTES[index % COVER_PALETTES.length];
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const words = title.split(" ");
  const lines = [];
  for (const word of words) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= 12) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  const titleSvg = lines
    .slice(0, 4)
    .map((line, i) => `<tspan x="20" dy="${i === 0 ? 0 : 30}">${esc(line)}</tspan>`)
    .join("");
  // Shrink long author names so they stay inside the 160px text frame.
  const authorSize = Math.min(13, Math.floor(200 / Math.max(author.length, 1)));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="200" height="300" fill="url(#g)"/>` +
    `<rect x="12" y="12" width="176" height="276" fill="none" stroke="${ink}" stroke-opacity="0.35"/>` +
    `<text x="20" y="72" font-family="Georgia, serif" font-size="26" font-weight="600" fill="${ink}">${titleSvg}</text>` +
    `<text x="20" y="268" font-family="Helvetica, Arial, sans-serif" font-size="${authorSize}" letter-spacing="1.2" fill="${ink}" fill-opacity="0.85">${esc(author.toUpperCase())}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const RAW_BOOKS = [
  ["The Remains of the Day", "Kazuo Ishiguro", 258, "read", 5, "Classic Literature", true, "Stevens and the long drive west."],
  ["Piranesi", "Susanna Clarke", 272, "reading", null, "Fantasy", true, ""],
  ["Braiding Sweetgrass", "Robin Wall Kimmerer", 408, "want", null, "Non-Fiction", false, ""],
  ["The Left Hand of Darkness", "Ursula K. Le Guin", 304, "read", 4, "Science Fiction", false, "Re-read for book club."],
  ["Rebecca", "Daphne du Maurier", 410, "read", 5, "Mystery & Thriller", true, ""],
  ["Crying in H Mart", "Michelle Zauner", 256, "reading", null, "Biography & Memoir", false, ""],
  ["Station Eleven", "Emily St. John Mandel", 333, "want", null, "Fiction", false, ""],
  ["Meditations", "Marcus Aurelius", 254, "read", 3, "Philosophy", false, ""],
];

export const SAMPLE_BOOKS = RAW_BOOKS.map(([title, author, pages, status, rating, genre, isFavorite, notes], i) => ({
  id: `book-${i + 1}`,
  title,
  author,
  pages,
  status,
  rating,
  genre,
  notes,
  isFavorite,
  coverUrl: sampleCover(title, author, i),
  fileAttachment: i === 0 ? { name: "remains-of-the-day.epub", size: 1843200, type: "application/epub+zip" } : null,
}));

export const SAMPLE_USER = {
  id: "user-1",
  email: "maya.reads@example.com",
  displayName: "Maya Okafor",
  avatarUrl: null,
  shareSlug: "maya-reads",
  isProfilePublic: true,
  profileVisibility: { showCurrentlyReading: true, showFavorites: true, showRatings: true },
};

const fileUrl = (file) => (typeof URL !== "undefined" && file instanceof Blob ? URL.createObjectURL(file) : null);
const fileMeta = (file) => ({ name: file.name, size: file.size, type: file.type });

/**
 * Root wrapper for every Shelved component: provides the signed-in user, the
 * book shelf (in-memory, fully interactive), light/dark theme and an
 * in-memory router. Components that read useAuth / useBooks / useTheme or
 * render NavLinks throw or render blank without it.
 */
export function ShelvedProvider({
  children,
  theme: initialTheme = "light",
  user: initialUser = SAMPLE_USER,
  books: initialBooks = SAMPLE_BOOKS,
  initialPath = "/library",
  animations,
}) {
  // A provider inside another one (e.g. a dark-themed island inside a light
  // screen) is "nested": it scopes its theme to its own subtree, reuses the
  // outer router (react-router forbids nesting routers) and inherits the
  // outer animation setting unless given one explicitly.
  const isNested = useContext(ThemeContext) !== null;
  const inRouter = useInRouterContext();

  // framer-motion's global switch: false renders every motion element in its
  // final state (static mockups / screenshots). Set before children mount.
  if (animations !== undefined || !isNested) MotionGlobalConfig.skipAnimations = animations === false;

  const [theme, setTheme] = useState(initialTheme);
  const [user, setUser] = useState(initialUser);
  const [books, setBooks] = useState(initialBooks);

  useEffect(() => setTheme(initialTheme), [initialTheme]);
  useEffect(() => {
    if (!isNested) document.documentElement.dataset.theme = theme;
  }, [theme, isNested]);

  const themeValue = useMemo(
    () => ({ theme, setTheme, toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [theme]
  );

  const authValue = useMemo(
    () => ({
      user,
      isLoading: false,
      signUp: async ({ displayName, email }) => {
        const next = { ...SAMPLE_USER, displayName: displayName || SAMPLE_USER.displayName, email };
        setUser(next);
        return next;
      },
      signIn: async ({ email }) => {
        const next = { ...SAMPLE_USER, email };
        setUser(next);
        return next;
      },
      signInWithGoogle: async () => setUser(SAMPLE_USER),
      signOut: async () => setUser(null),
      updateProfile: async (fields) => {
        const next = { ...user, ...fields, avatarUrl: fields.avatarFile ? fileUrl(fields.avatarFile) : user.avatarUrl };
        delete next.avatarFile;
        setUser(next);
        return next;
      },
      updateSharingSettings: async (settings) => {
        const next = {
          ...user,
          ...settings,
          profileVisibility: { ...user.profileVisibility, ...(settings.profileVisibility ?? {}) },
        };
        setUser(next);
        return next;
      },
    }),
    [user]
  );

  const patchBook = useCallback((bookId, patch) => {
    let updated;
    setBooks((current) =>
      current.map((book) => {
        if (book.id !== bookId) return book;
        updated = { ...book, ...(typeof patch === "function" ? patch(book) : patch) };
        return updated;
      })
    );
    return Promise.resolve(updated);
  }, []);

  const booksValue = useMemo(
    () => ({
      books,
      isLoading: false,
      addBook: async ({ coverFile, ebookFile, ...fields }) => {
        const book = {
          id: `book-${Date.now()}`,
          notes: "",
          rating: null,
          isFavorite: false,
          ...fields,
          pages: fields.pages ? Number(fields.pages) : null,
          coverUrl: coverFile ? fileUrl(coverFile) : null,
          fileAttachment: ebookFile ? fileMeta(ebookFile) : null,
        };
        setBooks((current) => [book, ...current]);
        return book;
      },
      updateBook: (bookId, patch) => patchBook(bookId, patch),
      setStatus: (bookId, status) => patchBook(bookId, { status }),
      toggleFavorite: (bookId) => patchBook(bookId, (book) => ({ isFavorite: !book.isFavorite })),
      removeBook: async (bookId) => setBooks((current) => current.filter((book) => book.id !== bookId)),
      attachFile: (bookId, file) => patchBook(bookId, { fileAttachment: fileMeta(file) }),
      updateCoverImage: (bookId, file) => patchBook(bookId, { coverUrl: fileUrl(file) }),
      removeFileAttachment: (bookId) => patchBook(bookId, { fileAttachment: null }),
    }),
    [books, patchBook]
  );

  const routed = inRouter ? children : <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>;

  return (
    <ThemeContext.Provider value={themeValue}>
      <AuthContext.Provider value={authValue}>
        <BooksContext.Provider value={booksValue}>
          {isNested ? (
            // display: contents keeps layout untouched; the attribute alone
            // re-scopes every theme token for this subtree.
            <div data-theme={theme} style={{ display: "contents" }}>
              {routed}
            </div>
          ) : (
            routed
          )}
        </BooksContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
