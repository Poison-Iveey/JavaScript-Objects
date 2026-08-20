import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { ShareLinkPanel } from "./ShareLinkPanel.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./ShareProfileModal.module.css";

export function ShareProfileModal({ isOpen, onClose }) {
  const { user, updateSharingSettings } = useAuth();

  if (!user) return null;

  const shareUrl = user.shareSlug ? `${window.location.origin}/u/${user.shareSlug}` : null;

  async function makePublic() {
    await updateSharingSettings({ isProfilePublic: true, profileVisibility: user.profileVisibility });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share your profile">
      <div className={styles.body}>
        {user.isProfilePublic && shareUrl ? (
          <>
            <p className={styles.hint}>Anyone with this link can view a read-only version of your shelf.</p>
            <ShareLinkPanel shareUrl={shareUrl} displayName={user.displayName} />
            <p className={styles.settingsHint}>Manage what's visible in Settings → Sharing.</p>
          </>
        ) : (
          <>
            <p className={styles.hint}>Your profile is currently private. Make it public to get a shareable link.</p>
            <Button onClick={makePublic}>Make my profile public</Button>
          </>
        )}
      </div>
    </Modal>
  );
}
