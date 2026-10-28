import { AuthForm } from "shelved";

const frame = { maxWidth: 380, padding: 24 } as const;

export const LogIn = () => (
  <div style={frame}>
    <AuthForm mode="login" />
  </div>
);

export const SignUp = () => (
  <div style={frame}>
    <AuthForm mode="signup" />
  </div>
);
