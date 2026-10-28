import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export function Modal({ title, onClose, width = 560, titleSize = 13, padding, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <>
      <div className={styles.scrim} onClick={onClose} />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width: `min(${width}px, calc(100% - 28px))`, padding }}
      >
        <div className={styles.head}>
          <span className={styles.title} style={{ fontSize: titleSize }}>
            {title}
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {children}
      </div>
    </>,
    document.body
  );
}
