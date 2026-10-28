import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Icon } from "../ui/Icon.jsx";
import { NAV_GROUPS } from "../../config/navigation.js";
import { useShell } from "./ShellContext.jsx";
import { useLibrary } from "../../hooks/useLibrary.js";
import { SidebarArt } from "./SidebarArt.jsx";
import styles from "./Sidebar.module.css";

export function Sidebar({ navKey, unread }) {
  const { mobile, collapsed, toggleCollapsed, closeDrawer } = useShell();
  const { books } = useLibrary();
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
          <SidebarArt />
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
