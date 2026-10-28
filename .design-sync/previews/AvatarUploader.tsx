import { AvatarUploader } from "shelved";

const noop = () => {};
// A stand-in profile photo: head-and-shoulders portrait on a warm backdrop.
const AVATAR =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9c3bc"/><stop offset="1" stop-color="#a88a82"/></linearGradient></defs>` +
      `<rect width="96" height="96" fill="url(#b)"/>` +
      `<path d="M30 44c0-14 8-22 18-22s18 8 18 22c0 6-2 12-2 18H32c0-6-2-12-2-18z" fill="#3b2a2a"/>` +
      `<ellipse cx="48" cy="44" rx="11" ry="13" fill="#c69a7e"/>` +
      `<path d="M18 96c2-18 14-26 30-26s28 8 30 26z" fill="#5b4a6e"/>` +
      `<rect x="43" y="54" width="10" height="12" fill="#c69a7e"/>` +
    `</svg>`
  );

// Top of the Settings profile card (max-width 420px); the uploader centres itself.
const card = { maxWidth: 380, padding: 16 } as const;

export const NoPhoto = () => (
  <div style={card}>
    <AvatarUploader avatarUrl={null} onFileAccepted={noop} />
  </div>
);

export const WithPhoto = () => (
  <div style={card}>
    <AvatarUploader avatarUrl={AVATAR} onFileAccepted={noop} />
  </div>
);
