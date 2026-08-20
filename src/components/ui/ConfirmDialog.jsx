import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";
import styles from "./ConfirmDialog.module.css";

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm" }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
