import { IconButton, ShelvedProvider } from "shelved";
import { BookOpen, Check, Heart, ImagePlus, Trash2 } from "lucide-react";

const row = { display: "flex", alignItems: "center", gap: 12, padding: 16 } as const;
const noop = () => {};

export const Variants = () => (
  <div style={row}>
    <IconButton icon={ImagePlus} label="Change cover image" onClick={noop} />
    <IconButton icon={Check} label="Mark as read" variant="accent" onClick={noop} />
    <IconButton icon={Trash2} label="Remove book" variant="danger" onClick={noop} />
  </div>
);

export const Favorite = () => (
  <div style={row}>
    <IconButton icon={Heart} iconProps={{ fill: "currentColor" }} label="Toggle favorite" variant="accent" onClick={noop} />
    <IconButton icon={Heart} iconProps={{ fill: "none" }} label="Toggle favorite" onClick={noop} />
  </div>
);

export const Disabled = () => (
  <div style={row}>
    <IconButton icon={Heart} label="Mark as read to favorite" disabled onClick={noop} />
    <IconButton icon={BookOpen} label="Start reading" disabled onClick={noop} />
  </div>
);

export const BookCardActions = () => (
  <div style={{ ...row, justifyContent: "space-between", width: 200 }}>
    <div style={{ display: "flex", gap: 4 }}>
      <IconButton icon={ImagePlus} label="Change cover image" onClick={noop} />
      <IconButton icon={BookOpen} label="Mark as read" variant="accent" onClick={noop} />
      <IconButton icon={Heart} label="Mark as read to favorite" disabled onClick={noop} />
    </div>
    <IconButton icon={Trash2} label="Remove book" variant="danger" onClick={noop} />
  </div>
);

export const DarkTheme = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={{ ...row, background: "var(--bg-app)", width: "fit-content", borderRadius: 14 }}>
      <IconButton icon={ImagePlus} label="Change cover image" onClick={noop} />
      <IconButton icon={BookOpen} label="Mark as read" variant="accent" onClick={noop} />
      <IconButton icon={Heart} iconProps={{ fill: "currentColor" }} label="Toggle favorite" variant="accent" onClick={noop} />
      <IconButton icon={Trash2} label="Remove book" variant="danger" onClick={noop} />
    </div>
  </ShelvedProvider>
);
