import { Share2 } from "lucide-react";
import { ShareLinkPanel } from "../profile/ShareLinkPanel.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./SharingSettings.module.css";

const VISIBILITY_OPTIONS = [
  { key: "showCurrentlyReading", label: "Show what I'm currently reading" },
  { key: "showFavorites", label: "Show my favorites" },
  { key: "showRatings", label: "Show my ratings" },
];

export function SharingSettings() {
  const { user, updateSharingSettings } = useAuth();
  const shareUrl = user.shareSlug ? `${window.location.origin}/u/${user.shareSlug}` : null;

  function handleTogglePublic(event) {
    updateSharingSettings({ isProfilePublic: event.target.checked, profileVisibility: user.profileVisibility });
  }

  function handleVisibilityChange(key, checked) {
    updateSharingSettings({
      isProfilePublic: user.isProfilePublic,
      profileVisibility: { ...user.profileVisibility, [key]: checked },
    });
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Share2 size={18} strokeWidth={1.75} />
        <h2 className={styles.sectionTitle}>Sharing</h2>
      </div>

      <label className={styles.toggleRow}>
        <input type="checkbox" checked={user.isProfilePublic} onChange={handleTogglePublic} />
        Make my profile public
      </label>

      {user.isProfilePublic && (
        <div className={styles.details}>
          {shareUrl && <ShareLinkPanel shareUrl={shareUrl} displayName={user.displayName} />}

          <div className={styles.visibilityList}>
            {VISIBILITY_OPTIONS.map(({ key, label }) => (
              <label key={key} className={styles.visibilityRow}>
                <input
                  type="checkbox"
                  checked={user.profileVisibility[key]}
                  onChange={(event) => handleVisibilityChange(key, event.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
          <p className={styles.notesHint}>Your private notes are never shown on your public profile.</p>
        </div>
      )}
    </section>
  );
}
