import { AppBackgroundScene, ShelvedProvider } from "shelved";

// The scene is position: fixed in the app; the transform makes this frame its
// containing block so it fills a 420px window instead of the whole viewport.
const window = {
  position: "relative",
  height: 420,
  overflow: "hidden",
  transform: "translateZ(0)",
  background: "var(--bg-app)",
} as const;

export const Light = () => (
  <div style={window}>
    <AppBackgroundScene />
  </div>
);

// [data-theme="dark"] is a plain attribute selector, so the wrapper scopes the dark tokens.
export const Dark = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={window}>
      <AppBackgroundScene />
    </div>
  </ShelvedProvider>
);
