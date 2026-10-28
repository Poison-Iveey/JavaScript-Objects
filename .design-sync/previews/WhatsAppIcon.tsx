import { WhatsAppIcon, ShelvedProvider } from "shelved";

const label = { fontSize: "var(--text-xs)", color: "var(--text-secondary)", fontWeight: 600 } as const;
const col = { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } as const;
const caption = {
  margin: "0 0 16px",
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-sm)",
  letterSpacing: "0.04em",
  color: "var(--heading-color)",
} as const;

// Single-color mark (currentColor) on a dusty-rose section band, at the sizes
// the app and designs use (16px in share pills, 24px in icon buttons).
export const Sizes = () => (
  <div style={{ padding: 24, background: "var(--bg-app)" }}>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 40,
        padding: "28px 32px",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-section-band)",
        color: "var(--text-primary)",
        width: "fit-content",
      }}
    >
      {[16, 24, 32, 48, 64].map((size) => (
        <div key={size} style={col}>
          <WhatsAppIcon size={size} />
          <span style={label}>{size}px</span>
        </div>
      ))}
    </div>
  </div>
);

const pill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: "var(--radius-pill)",
  background: "var(--bg-surface-raised)",
  color: "var(--text-primary)",
  fontWeight: 600,
} as const;

// How ShareLinkPanel presents it: a 16px mark in a dusty-rose share pill on a
// white card, plus a roomier 20px pill for larger layouts.
export const SharePill = () => (
  <div style={{ padding: 24, background: "var(--bg-app)" }}>
    <div
      style={{
        width: 340,
        padding: 24,
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-surface)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p style={caption}>Share to WhatsApp</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ ...pill, padding: "8px 12px", fontSize: "var(--text-xs)" }}>
          <WhatsAppIcon size={16} />
          WhatsApp
        </span>
        <span style={{ ...pill, gap: 8, padding: "10px 18px", fontSize: "var(--text-sm)" }}>
          <WhatsAppIcon size={20} />
          WhatsApp
        </span>
      </div>
    </div>
  </div>
);

const disk = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: "var(--radius-pill)",
  background: "var(--accent-fill)",
  color: "var(--text-on-accent)",
} as const;

const Accent = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 24, background: "var(--bg-surface)" }}>
    <span style={disk}>
      <WhatsAppIcon size={28} />
    </span>
    <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "var(--text-base)" }}>WhatsApp</span>
  </div>
);

// Reversed out of the accent fill: rosewood in light, antique gold in dark.
export const OnAccent = () => (
  <div style={{ display: "flex" }}>
    <div style={{ padding: 16, background: "var(--bg-app)" }}>
      <Accent />
    </div>
    <ShelvedProvider theme="dark" animations={false}>
      {/* The nested provider sets <html data-theme>, which the outer light provider also owns;
          data-theme on the wrapper scopes the dark tokens reliably. */}
      <div data-theme="dark" style={{ padding: 16, background: "var(--bg-app)" }}>
        <Accent />
      </div>
    </ShelvedProvider>
  </div>
);
