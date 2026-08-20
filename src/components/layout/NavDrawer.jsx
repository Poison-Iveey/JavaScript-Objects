import { NavLink } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { NAV_ITEMS, PRIMARY_MOBILE_NAV } from "../../config/navigation.js";
import styles from "./NavDrawer.module.css";

export function NavDrawer({ isOpen, onClose }) {
  const moreItems = NAV_ITEMS.filter((item) => !PRIMARY_MOBILE_NAV.includes(item.to));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="More">
      <div className={styles.list}>
        {moreItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={styles.item} onClick={onClose}>
            <Icon size={20} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </div>
    </Modal>
  );
}
