import { useState } from "react";
import { Input, ShelvedProvider } from "shelved";

const stack = { display: "flex", flexDirection: "column", gap: 12, padding: 16, maxWidth: 340 } as const;

export const Filled = () => {
  const [value, setValue] = useState("The Left Hand of Darkness");
  return (
    <div style={stack}>
      <Input id="input-title" value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};

export const Placeholder = () => {
  const [value, setValue] = useState("");
  return (
    <div style={stack}>
      <Input id="input-email" type="email" placeholder="you@example.com" value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};

export const Types = () => (
  <div style={stack}>
    <Input id="input-password" type="password" defaultValue="paperbacks" />
    <Input id="input-pages" type="number" defaultValue={304} />
  </div>
);

export const DarkTheme = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={{ ...stack, background: "var(--bg-app)" }}>
      <Input id="input-dark-title" defaultValue="Rebecca" />
      <Input id="input-dark-author" placeholder="Author" />
    </div>
  </ShelvedProvider>
);
