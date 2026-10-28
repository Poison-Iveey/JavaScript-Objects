import { SharingSettings, ShelvedProvider, SAMPLE_USER } from "shelved";

// Settings page column: parchment page, the section caps at 420px with 20px side margins.
const page = { maxWidth: 460, paddingTop: 20, paddingBottom: 20, background: "var(--bg-app)" } as const;

export const PublicProfile = () => (
  <div style={page}>
    <SharingSettings />
  </div>
);

export const PrivateProfile = () => (
  <ShelvedProvider animations={false} user={{ ...SAMPLE_USER, isProfilePublic: false }}>
    <div style={page}>
      <SharingSettings />
    </div>
  </ShelvedProvider>
);

export const RatingsHidden = () => (
  <ShelvedProvider
    animations={false}
    user={{
      ...SAMPLE_USER,
      profileVisibility: { showCurrentlyReading: true, showFavorites: true, showRatings: false },
    }}
  >
    <div style={page}>
      <SharingSettings />
    </div>
  </ShelvedProvider>
);

// Night mode: violet card, gold accents.
export const PublicProfileDark = () => (
  <ShelvedProvider animations={false} theme="dark">
    {/* data-theme on the wrapper: the provider only sets it on <html>, where the outer light provider wins. */}
    <div data-theme="dark" style={{ ...page, color: "var(--text-primary)" }}>
      <SharingSettings />
    </div>
  </ShelvedProvider>
);
