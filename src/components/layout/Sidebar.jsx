import { useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Icon } from "../ui/Icon.jsx";
import { NAV_GROUPS } from "../../config/navigation.js";
import { useShell } from "./ShellContext.jsx";
import { useJournal } from "../../hooks/useJournal.js";
import { useLibrary } from "../../hooks/useLibrary.js";
import styles from "./Sidebar.module.css";

const DEFAULT_ART = "/media/sidebar-artwork.jpeg";

export function Sidebar({ navKey, unread }) {
  const { mobile, collapsed, toggleCollapsed, closeDrawer, pickImage, takeImage } = useShell();
  const { sideArt } = useJournal();
  const { books } = useLibrary();
  const [artOver, setArtOver] = useState(false);
  const showLabels = mobile || !collapsed;

  // A different saved quote each day.
  const allQuotes = books.flatMap((b) => b.quotes.map((t) => ({ t, book: b.title })));
  const sideQuote = allQuotes.length ? allQuotes[new Date().getDate() % allQuotes.length] : null;

  const sideIcon = mobile ? "close" : collapsed ? "right" : "left";
  const sideTitle = mobile ? "Close menu" : collapsed ? "Expand menu" : "Collapse menu";

  return (
    <aside className={styles.aside}>
      <button
        type="button"
        className={styles.toggle}
        title={sideTitle}
        aria-label={sideTitle}
        onClick={mobile ? closeDrawer : toggleCollapsed}
      >
        <Icon name={sideIcon} size={16} stroke="currentColor" strokeWidth={1.8} />
      </button>

      {NAV_GROUPS.map((g, gi) => (
        <div key={g.label} className={styles.group}>
          {showLabels && <span className={styles.groupLabel}>{g.label}</span>}
          {!showLabels && gi > 0 && <span className={styles.sep} />}
          {g.items.map((n) => (
            <NavLink
              key={n.key}
              to={n.to}
              title={n.label}
              className={clsx(styles.item, navKey === n.key && styles.active)}
            >
              <Icon name={n.icon} size={19} />
              {showLabels && <span className={styles.label}>{n.label}</span>}
              {n.key === "msgs" && unread > 0 && <span className={styles.badge}>{unread}</span>}
            </NavLink>
          ))}
        </div>
      ))}

      {showLabels && (
        <div className={styles.bottom}>
          <button
            type="button"
            data-drop-art
            className={clsx(styles.art, artOver && styles.artOver)}
            title="Change sidebar artwork"
            onClick={() => pickImage("art")}
            onDragOver={(e) => {
              e.preventDefault();
              setArtOver(true);
            }}
            onDragLeave={() => setArtOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArtOver(false);
              const f = Array.from(e.dataTransfer.files).find((x) => x.type.startsWith("image/"));
              if (f) takeImage(f, "art");
            }}
          >
            <img src={sideArt || DEFAULT_ART} alt="" />
            <span className={styles.artHint}>Drop or choose artwork</span>
          </button>
          {sideQuote && (
            <div className={styles.quote}>
              <span className={styles.quoteLabel}>From your quotes</span>
              <span className={styles.quoteText}>“{sideQuote.t}”</span>
              <span className={styles.quoteBook}>{sideQuote.book}</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
