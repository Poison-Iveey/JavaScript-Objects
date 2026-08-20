import { LogOut, Palette } from "lucide-react";
import { AppHeader } from "../components/layout/AppHeader.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ProfileForm } from "../components/settings/ProfileForm.jsx";
import { SharingSettings } from "../components/settings/SharingSettings.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.js";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
  const { signOut } = useAuth();

  return (
    <AppShell>
      <AppHeader title="Settings" />

      <div className={styles.coverBanner} />

      <div className={styles.profileCardWrap}>
        <ProfileForm />
      </div>

      <div className={styles.stack}>
        <SharingSettings />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Palette size={18} strokeWidth={1.75} />
            <h2 className={styles.sectionTitle}>Themes</h2>
          </div>
          <p className={styles.comingSoon}>More themes to choose from — coming soon.</p>
        </section>

        <div className={styles.logoutRow}>
          <Button variant="danger" onClick={signOut}>
            <LogOut size={18} strokeWidth={1.75} />
            Log out
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
