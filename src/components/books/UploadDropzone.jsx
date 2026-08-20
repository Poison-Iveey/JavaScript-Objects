import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import clsx from "clsx";
import styles from "./UploadDropzone.module.css";

export function UploadDropzone({ onFileAccepted, previewUrl, shape = "square", label = "Drop an image or tap to browse" }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles[0]) onFileAccepted(acceptedFiles[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(styles.dropzone, styles[shape], isDragActive && styles.active)}
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <img src={previewUrl} alt="" className={styles.preview} />
      ) : (
        <div className={styles.placeholder}>
          <ImagePlus size={24} strokeWidth={1.5} />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
