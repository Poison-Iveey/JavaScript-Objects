import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Sidebar } from "./Sidebar.jsx";
import { Banner } from "./Banner.jsx";
import { ShellProvider, useShell } from "./ShellContext.jsx";
import { Icon } from "../ui/Icon.jsx";
import { Avatar, Button, ThemeButton } from "../ui/controls.jsx";
import { AddBookModal } from "../books/AddBookModal.jsx";
import { BookDetailModal } from "../books/BookDetailModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useJournal } from "../../hooks/useJournal.js";
import { useTheme } from "../../hooks/useTheme.js";
import { TAB_BAR, pageFor } from "../../config/navigation.js";
import { READERS } from "../../data/community.js";
import { greeting } from "../../utils/dates.js";
import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <ShellProvider>
      <ShellFrame />
    </ShellProvider>
  );
}

function ShellFrame() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { unread } = useJournal();
  const shell = useShell();
  const mainRef = useRef(null);

  const page = pageFor(pathname);
  const reader = pathname.startsWith("/readers/") ? READERS.find((r) => r.id === pathname.split("/")[2]) : null;
  const title = reader ? reader.name : page.title;
  const totalUnread = Object.values(unread || {}).reduce((a, n) => a + (n || 0), 0);
  const chatFlag = /^\/messages\/.+/.test(pathname) ? "thread" : "list";

  // Each page starts at the top.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div
      className={styles.root}
      data-theme={theme}
      data-m={shell.mobile ? "1" : "0"}
      data-dr={shell.drawer ? "1" : "0"}
      data-chat={chatFlag}
    >
      <div className={styles.viewport}>
        <div className={styles.frame}>
          {shell.mobile && shell.drawer && <div className={styles.scrim} onClick={shell.closeDrawer} />}
          <Sidebar navKey={page.key} unread={totalUnread} />
          <main ref={mainRef} className={styles.main}>
            <div className={styles.mobileBar}>
              <button type="button" className={styles.menuButton} title="Menu" aria-label="Open menu" onClick={shell.openDrawer}>
                <Icon name="menu" size={20} stroke="currentColor" />
                {totalUnread > 0 && <span className={styles.dot} />}
              </button>
              <span className={styles.mobileTitle}>{page.mobileTitle || title}</span>
              <ThemeButton size={44} />
            </div>

            <Banner />

            <div className={styles.pageHead}>
              <div className={styles.headText}>
                <div className={styles.greeting}>{greeting(user?.displayName)}</div>
                <h2 className={styles.pageTitle}>{title}</h2>
                <div className={styles.ornament} aria-hidden="true">
                  <span />
                  <span>✦</span>
                  <span />
                </div>
              </div>
              <div className={styles.headActions}>
                <Button className={styles.addButton} onClick={() => shell.openAdd()}>
                  <Icon name="plus" size={15} stroke="currentColor" strokeWidth={2.2} />
                  Add book
                </Button>
                <ThemeButton />
                <button type="button" className={styles.avatarButton} title="Profile" onClick={() => navigate("/profile")}>
                  <Avatar src={user?.avatarUrl} name={user?.displayName} />
                </button>
              </div>
            </div>

            <Outlet />

            <div className={styles.footerOrnament} aria-hidden="true">
              <span />
              ✦<span className={styles.moon}>☾</span>✦
              <span />
            </div>
          </main>
        </div>
      </div>

      <nav className={styles.tabBar}>
        {TAB_BAR.map((t) =>
          t.key === "add" ? (
            <button key="add" type="button" className={styles.fab} title="Add book" aria-label="Add book" onClick={() => shell.openAdd()}>
              <Icon name="plus" size={20} stroke="currentColor" strokeWidth={2.2} />
            </button>
          ) : (
            <NavLink key={t.key} to={t.to} className={clsx(styles.tab, page.key === t.key && styles.tabOn)} style={{ textDecoration: "none" }}>
              <Icon name={t.icon} size={21} strokeWidth={1.6} />
              <span>{t.label}</span>
              {t.key === "msgs" && totalUnread > 0 && <span className={styles.tabBadge}>{totalUnread}</span>}
            </NavLink>
          )
        )}
      </nav>

      <BookDetailModal />
      <AddBookModal />

      {shell.dragging && (
        <div className={styles.dropOverlay}>
          <div className={styles.dropBox}>
            <Icon name="upload" size={40} strokeWidth={1.4} />
            <span>{shell.dropLabel}</span>
          </div>
        </div>
      )}

      {shell.toast && (
        <div className={styles.toast} role="status">
          {shell.toast}
        </div>
      )}
    </div>
  );
}
