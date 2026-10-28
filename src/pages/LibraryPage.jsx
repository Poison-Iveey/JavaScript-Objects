import { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { UnderlineTabs, controlStyles } from "../components/ui/controls.jsx";
import { BookTile, DropTile } from "../components/books/BookTile.jsx";
import { shelfTabs } from "../components/dashboard/widgets.jsx";
import { useShell } from "../components/layout/ShellContext.jsx";
import { useLibrary } from "../hooks/useLibrary.js";
import styles from "./pages.module.css";

// The full shelf, or (wishlist) just the books you want to read.
export function LibraryPage({ wishlist = false }) {
  const { books } = useLibrary();
  const { openDetail, pickImage } = useShell();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const filter = wishlist ? "want" : tab;
  const q = query.trim().toLowerCase();
  const shown = books.filter(
    (b) => (filter === "all" || b.status === filter) && (!q || (b.title + " " + b.author).toLowerCase().includes(q))
  );

  return (
    <Card roomy style={{ marginTop: 24 }}>
      <div className={styles.libHead}>
        <div className={styles.libTabs}>
          {!wishlist && <UnderlineTabs large items={shelfTabs(books)} value={tab} onChange={setTab} />}
        </div>
        <input
          className={`${controlStyles.input} ${styles.search}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or author"
          aria-label="Search title or author"
          style={{ padding: "8px 12px" }}
        />
      </div>
      <div className={styles.libGrid}>
        {shown.map((b) => (
          <BookTile key={b.id} book={b} onOpen={openDetail} showStatus />
        ))}
        <DropTile onClick={() => pickImage("new")} />
      </div>
    </Card>
  );
}
