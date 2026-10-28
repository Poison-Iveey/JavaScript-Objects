import { BottomNav, ShelvedProvider } from "shelved";

// BottomNav is sticky to the bottom of the mobile column (<860px viewports).
const phone = {
  position: "relative",
  width: 390,
  height: 200,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  background: "var(--bg-app)",
} as const;

export const LibraryActive = () => (
  <div style={phone}>
    <BottomNav />
  </div>
);

// [data-theme="dark"] is a plain attribute selector, so the wrapper scopes the dark tokens.
export const DarkMode = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={phone}>
      <BottomNav />
    </div>
  </ShelvedProvider>
);
