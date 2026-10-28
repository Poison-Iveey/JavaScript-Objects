import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Button, Segmented, ToggleRow } from "../components/ui/controls.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useJournal } from "../hooks/useJournal.js";
import { useTheme } from "../hooks/useTheme.js";
import styles from "./pages.module.css";

const NOTIFICATIONS = [
  ["followers", "New followers"],
  ["msgs", "New messages"],
  ["likes", "Likes on my reviews"],
  ["releases", "Upcoming release reminders"],
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings, setSettings, profile, resetSample } = useJournal();
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.wrap} style={{ marginTop: 22 }}>
      <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card roomy>
          <CardHeader icon="sun" title="Appearance" />
          <Segmented
            items={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            value={theme}
            onChange={setTheme}
            style={{ marginTop: 14 }}
          />
          <div style={{ marginTop: 6 }}>
            <ToggleRow
              label="Start with the sidebar collapsed"
              on={!!settings.startCollapsed}
              onToggle={() => setSettings({ startCollapsed: !settings.startCollapsed })}
            />
            <ToggleRow label="Pause the header video" on={!!settings.pauseVideo} onToggle={() => setSettings({ pauseVideo: !settings.pauseVideo })} />
          </div>
        </Card>
        <Card roomy>
          <CardHeader icon="chat" title="Notifications" />
          <div style={{ marginTop: 6 }}>
            {NOTIFICATIONS.map(([k, label]) => (
              <ToggleRow
                key={k}
                label={label}
                on={!!settings.notif[k]}
                onToggle={() => setSettings({ notif: { ...settings.notif, [k]: !settings.notif[k] } })}
              />
            ))}
          </div>
        </Card>
      </div>

      <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card roomy className={styles.cardStack}>
          <CardHeader icon="user" title="Privacy" />
          <p className={styles.muted} style={{ lineHeight: 1.55 }}>
            Choose what other readers see on your public profile.
          </p>
          <Button variant="outline" style={{ alignSelf: "flex-start" }} onClick={() => navigate("/profile/edit")}>
            Manage profile visibility
          </Button>
        </Card>
        <Card roomy className={styles.cardStack}>
          <CardHeader icon="log" title="Account" />
          {[
            ["Name", user.displayName],
            ["Handle", profile.handle],
            ["Email", user.email || "—"],
          ].map(([k, v]) => (
            <div key={k} className={styles.accRow}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
          <div className={styles.formRow}>
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
            <Button variant="outline" style={{ color: "var(--danger)" }} onClick={resetSample}>
              Reset sample data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
