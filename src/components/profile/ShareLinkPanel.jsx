import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  TikTokIcon,
  SubstackIcon,
} from "./SocialIcons.jsx";
import styles from "./ShareLinkPanel.module.css";

function shareText(displayName) {
  return `Check out ${displayName}'s bookshelf on BookBox`;
}

// Twitter/Facebook/WhatsApp all have real web "share intent" URLs that open a
// pre-filled compose screen — no login/app required.
const DIRECT_NETWORKS = [
  {
    key: "twitter",
    label: "Twitter / X",
    icon: TwitterIcon,
    url: (shareUrl, displayName) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText(displayName))}&url=${encodeURIComponent(shareUrl)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FacebookIcon,
    url: (shareUrl) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: WhatsAppIcon,
    url: (shareUrl, displayName) =>
      `https://wa.me/?text=${encodeURIComponent(`${shareText(displayName)} ${shareUrl}`)}`,
  },
];

// Instagram, TikTok and Substack have no public "share this link" web intent —
// unlike the three above, there's no URL that opens a pre-filled post for them.
// Best honest option: copy the link and hand off to the platform so the user
// can paste it themselves (bio, story, note, etc).
const COPY_AND_OPEN_NETWORKS = [
  { key: "instagram", label: "Instagram", icon: InstagramIcon, homeUrl: "https://www.instagram.com/" },
  { key: "tiktok", label: "TikTok", icon: TikTokIcon, homeUrl: "https://www.tiktok.com/upload" },
  { key: "substack", label: "Substack", icon: SubstackIcon, homeUrl: "https://substack.com/" },
];

export function ShareLinkPanel({ shareUrl, displayName }) {
  const [copied, setCopied] = useState(false);
  const [hint, setHint] = useState(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleCopyAndOpen(network) {
    await navigator.clipboard.writeText(shareUrl);
    window.open(network.homeUrl, "_blank", "noopener,noreferrer");
    setHint(`Link copied — paste it on ${network.label}`);
    setTimeout(() => setHint(null), 3000);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.linkRow}>
        <input className={styles.linkInput} value={shareUrl} readOnly onFocus={(e) => e.target.select()} />
        <button type="button" className={styles.copyButton} onClick={handleCopy}>
          {copied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={1.75} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className={styles.socialRow}>
        {DIRECT_NETWORKS.map(({ key, label, icon: Icon, url }) => (
          <a
            key={key}
            className={styles.socialButton}
            href={url(shareUrl, displayName)}
            target="_blank"
            rel="noreferrer"
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
        {COPY_AND_OPEN_NETWORKS.map((network) => (
          <button
            key={network.key}
            type="button"
            className={styles.socialButton}
            onClick={() => handleCopyAndOpen(network)}
          >
            <network.icon size={16} />
            {network.label}
          </button>
        ))}
      </div>

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
