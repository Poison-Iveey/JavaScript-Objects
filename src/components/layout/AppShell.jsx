import { Sidebar } from "./Sidebar.jsx";
import { BottomNav } from "./BottomNav.jsx";
import { AppBackgroundScene } from "../decor/AppBackgroundScene.jsx";
import styles from "./AppShell.module.css";

export function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <AppBackgroundScene />
      <Sidebar />
      <div className={styles.column}>
        <main className={styles.content}>
          <div className={styles.contentInner}>{children}</div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
