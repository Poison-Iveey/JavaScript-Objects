import { ThemeToggle, ShelvedProvider } from "shelved";

const row = { display: "flex", alignItems: "center", gap: 12, padding: 16 } as const;
const caption = { fontSize: 14, color: "var(--text-secondary)" } as const;

export const LightMode = () => (
  <div style={row}>
    <ThemeToggle />
    <span style={caption}>Switch to dark mode</span>
  </div>
);

export const DarkMode = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={{ ...row, background: "var(--bg-app)", borderRadius: 14, width: "fit-content", paddingRight: 24 }}>
      <ThemeToggle />
      <span style={caption}>Switch to light mode</span>
    </div>
  </ShelvedProvider>
);
