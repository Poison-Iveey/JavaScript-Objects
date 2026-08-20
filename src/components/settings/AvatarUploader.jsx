import { UploadDropzone } from "../books/UploadDropzone.jsx";
import styles from "./AvatarUploader.module.css";

export function AvatarUploader({ avatarUrl, onFileAccepted }) {
  return (
    <div className={styles.wrapper}>
      <UploadDropzone shape="circle" previewUrl={avatarUrl} onFileAccepted={onFileAccepted} label="Change photo" />
    </div>
  );
}
