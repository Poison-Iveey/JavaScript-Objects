import { ShelvedProvider, BookCard, AuthForm, SAMPLE_BOOKS } from "shelved";

const row = { display: "grid", gridTemplateColumns: "repeat(2, 180px)", gap: 16 } as const;

export const LightTheme = () => (
  <ShelvedProvider theme="light" animations={false}>
    <div data-theme="light" style={{ padding: 16, background: "var(--bg-app)" }}>
      <div style={row}>
        <BookCard book={SAMPLE_BOOKS[1]} />
        <BookCard book={SAMPLE_BOOKS[4]} />
      </div>
    </div>
  </ShelvedProvider>
);

export const DarkTheme = () => (
  <ShelvedProvider theme="dark" animations={false}>
    <div data-theme="dark" style={{ padding: 16, background: "var(--bg-app)" }}>
      <div style={row}>
        <BookCard book={SAMPLE_BOOKS[1]} />
        <BookCard book={SAMPLE_BOOKS[4]} />
      </div>
    </div>
  </ShelvedProvider>
);

export const SignedOut = () => (
  <ShelvedProvider user={null} animations={false}>
    <div data-theme="light" style={{ padding: 24, background: "var(--bg-app)", maxWidth: 420 }}>
      <AuthForm mode="login" />
    </div>
  </ShelvedProvider>
);
