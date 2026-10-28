import { useState } from "react";
import { StatusControl, ShelvedProvider } from "shelved";

type Status = "want" | "reading" | "read";
const field = { maxWidth: 400, padding: 16 } as const;

const Demo = ({ initial }: { initial: Status }) => {
  const [status, setStatus] = useState<Status>(initial);
  return (
    <div style={field}>
      <StatusControl value={status} onChange={setStatus} />
    </div>
  );
};

export const WantToRead = () => <Demo initial="want" />;
export const Reading = () => <Demo initial="reading" />;
export const Read = () => <Demo initial="read" />;

// Night mode: gold selected pill on violet.
export const ReadingDark = () => (
  <ShelvedProvider animations={false} theme="dark">
    {/* data-theme on the wrapper: the provider only sets it on <html>, where the outer light provider wins. */}
    <div data-theme="dark" style={{ maxWidth: 432, background: "var(--bg-app)", color: "var(--text-primary)", padding: 8 }}>
      <Demo initial="reading" />
    </div>
  </ShelvedProvider>
);
