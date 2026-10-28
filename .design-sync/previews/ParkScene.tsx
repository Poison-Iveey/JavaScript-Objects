import { ParkScene, ShelvedProvider } from "shelved";

const hero = { position: "relative", height: 440, overflow: "hidden", background: "var(--bg-app)" } as const;

export const Day = () => (
  <div style={hero}>
    <ParkScene leafCount={10} />
  </div>
);

export const Dusk = () => (
  <div style={hero}>
    <ParkScene variant="dusk" leafCount={16} />
  </div>
);

// [data-theme="dark"] is a plain attribute selector, so the wrapper scopes the dark tokens.
export const DarkTheme = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={hero}>
      <ParkScene leafCount={10} />
    </div>
  </ShelvedProvider>
);
