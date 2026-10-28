import { FallingLeaves } from "shelved";

const box = { position: "relative", height: 320, background: "var(--bg-app)", overflow: "hidden" } as const;

export const Default = () => (
  <div style={box}>
    <FallingLeaves />
  </div>
);

export const Ambient = () => (
  <div style={box}>
    <FallingLeaves count={7} opacity={0.4} />
  </div>
);

export const Dense = () => (
  <div style={box}>
    <FallingLeaves count={28} />
  </div>
);
