import { GoogleIcon, Button } from "shelved";

export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, padding: 16 }}>
    <GoogleIcon size={16} />
    <GoogleIcon />
    <GoogleIcon size={24} />
    <GoogleIcon size={32} />
  </div>
);

export const InGoogleButton = () => (
  <div style={{ padding: 16, maxWidth: 340 }}>
    <Button variant="secondary">
      <GoogleIcon />
      Continue with Google
    </Button>
  </div>
);
