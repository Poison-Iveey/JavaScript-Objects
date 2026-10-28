import { ShareLinkPanel, ShelvedProvider } from "shelved";

const URL = "https://bookbox.app/u/maya-reads";

const card = {
  boxSizing: "border-box",
  background: "var(--bg-surface)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-md)",
} as const;

const title = {
  margin: "0 0 6px",
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-lg)",
  color: "var(--heading-color)",
} as const;

const hint = { margin: "0 0 14px", fontSize: "var(--text-sm)", color: "var(--text-secondary)" } as const;

// Inside the Share-your-profile modal: 480px sheet, 24px body padding.
export const InShareModal = () => (
  <div style={{ padding: 24, background: "var(--bg-app)" }}>
    <div style={{ ...card, width: 480, padding: 24 }}>
      <h3 style={title}>Share your profile</h3>
      <p style={hint}>Anyone with this link can view a read-only version of your shelf.</p>
      <ShareLinkPanel shareUrl={URL} displayName="Maya Okafor" />
    </div>
  </div>
);

// SharingSettings section card: max-width 420px, 16px padding, white surface.
export const InSettingsCard = () => (
  <div style={{ padding: 24, background: "var(--bg-app)" }}>
    <div style={{ ...card, width: 420, padding: 16, boxShadow: "var(--shadow-sm)" }}>
      <ShareLinkPanel shareUrl={URL} displayName="Maya Okafor" />
    </div>
  </div>
);

// Phone-width sheet: the social pills wrap onto more rows.
export const PhoneWidth = () => (
  <div style={{ padding: 20, background: "var(--bg-app)" }}>
    <div style={{ ...card, width: 320, padding: 20 }}>
      <ShareLinkPanel shareUrl="https://bookbox.app/u/theo-turns-pages" displayName="Theo Lindqvist" />
    </div>
  </div>
);

// Dark theme: Arcane Violet card, antique-gold Copy button.
export const DarkTheme = () => (
  <ShelvedProvider theme="dark" animations={false}>
    {/* data-theme on the wrapper scopes the dark tokens; the nested provider alone races the outer one for <html data-theme>. */}
    <div data-theme="dark" style={{ padding: 24, background: "var(--bg-app)" }}>
      <div style={{ ...card, width: 480, padding: 24 }}>
        <h3 style={title}>Share your profile</h3>
        <p style={hint}>Anyone with this link can view a read-only version of your shelf.</p>
        <ShareLinkPanel shareUrl="https://bookbox.app/u/june-after-dark" displayName="June Haddad" />
      </div>
    </div>
  </ShelvedProvider>
);
