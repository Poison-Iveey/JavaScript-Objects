import { useEffect, useState } from "react";
import { FormField, Input } from "../ui/FormField.jsx";
import { Button } from "../ui/Button.jsx";
import { AvatarUploader } from "./AvatarUploader.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./ProfileForm.module.css";

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [avatarFile, setAvatarFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    const updated = await updateProfile({ displayName, email, avatarFile });
    setAvatarFile(null);
    setAvatarPreview(updated.avatarUrl);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <AvatarUploader avatarUrl={avatarPreview} onFileAccepted={setAvatarFile} />

      <FormField label="Display name" id="profile-name">
        <Input id="profile-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      </FormField>

      <FormField label="Email" id="profile-email">
        <Input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormField>

      <Button type="submit" disabled={status === "saving"}>
        {status === "saved" ? "Saved!" : status === "saving" ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
