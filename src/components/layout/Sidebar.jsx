import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BookMarked, ChevronsLeft, ChevronsRight, Share2 } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "../ui/ThemeToggle.jsx";
import { ShareProfileModal } from "../profile/ShareProfileModal.jsx";
import { NAV_ITEMS } from "../../config/navigation.js";
import { useAuth } from "../../hooks/useAuth.js";
import { getJSON, setJSON } from "../../services/storage.js";
import styles from "./Sidebar.module.css";

const COLLAPSED_KEY = "sidebar.collapsed";

export function Sidebar() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => getJSON(COLLAPSED_KEY, false));
  const [isShareOpen, setIsShareOpen] = useState(false);

  function toggleCollapsed() {
    setIsCollapsed((current) => {
      const next = !current;
      setJSON(COLLAPSED_KEY, next);
      return next;
    });
  }

  return (
    <aside className={clsx(styles.sidebar, isCollapsed && styles.collapsed)}>
      <div className={styles.brand}>
        <BookMarked size={26} strokeWidth={1.5} />
        {!isCollapsed && <span className={styles.brandName}>BookBox</span>}
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
            title={isCollapsed ? label : undefined}
          >
            <Icon size={20} strokeWidth={1.75} />
            {!isCollapsed && label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className={styles.collapseToggle} onClick={toggleCollapsed}>
        {isCollapsed ? <ChevronsRight size={18} strokeWidth={1.75} /> : <ChevronsLeft size={18} strokeWidth={1.75} />}
        {!isCollapsed && <span>Collapse</span>}
      </button>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.shareButton}
          onClick={() => setIsShareOpen(true)}
          title="Share profile"
        >
          <Share2 size={18} strokeWidth={1.75} />
          {!isCollapsed && <span>Share profile</span>}
        </button>
        <div className={styles.footerRow}>
          {!isCollapsed && user && <span className={styles.userName}>{user.displayName}</span>}
          <ThemeToggle />
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.logoStamp}>
          <img src="/images/bookbox-logo.png" alt="BookBox" />
        </div>
      )}

      <ShareProfileModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </aside>
  );
}
