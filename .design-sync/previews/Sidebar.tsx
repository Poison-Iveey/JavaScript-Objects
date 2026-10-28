import { useEffect } from "react";
import { ShelvedProvider, Sidebar } from "shelved";

const frame = { display: "flex", height: 720, background: "var(--bg-app)" } as const;

export const LibraryActive = () => (
  <div style={frame}>
    <Sidebar />
  </div>
);

// Sidebar reads its collapsed state from localStorage ("shelved.sidebar.collapsed").
const CollapsedFrame = ({ children }: { children: React.ReactNode }) => {
  try {
    localStorage.setItem("shelved.sidebar.collapsed", "true");
  } catch {}
  useEffect(() => {
    try {
      localStorage.removeItem("shelved.sidebar.collapsed");
    } catch {}
  }, []);
  return <div style={frame}>{children}</div>;
};

export const Collapsed = () => (
  <CollapsedFrame>
    <Sidebar />
  </CollapsedFrame>
);

// [data-theme="dark"] is a plain attribute selector, so the wrapper scopes the dark tokens.
export const DarkMode = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={frame}>
      <Sidebar />
    </div>
  </ShelvedProvider>
);
