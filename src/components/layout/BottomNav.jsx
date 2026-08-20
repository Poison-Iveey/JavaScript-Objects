import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { NAV_ITEMS, PRIMARY_MOBILE_NAV } from "../../config/navigation.js";
import { NavDrawer } from "./NavDrawer.jsx";
import styles from "./BottomNav.module.css";

export function BottomNav() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  const primaryTabs = PRIMARY_MOBILE_NAV.map((path) => NAV_ITEMS.find((item) => item.to === path));
  const isMoreActive = NAV_ITEMS.some(
    (item) => !PRIMARY_MOBILE_NAV.includes(item.to) && location.pathname.startsWith(item.to)
  );

  return (
    <nav className={styles.nav}>
      {primaryTabs.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => clsx(styles.tab, isActive && styles.active)}>
          <Icon size={22} strokeWidth={1.75} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        className={clsx(styles.tab, isMoreActive && styles.active)}
        onClick={() => setIsMoreOpen(true)}
      >
        <MoreHorizontal size={22} strokeWidth={1.75} />
        <span className={styles.label}>More</span>
      </button>

      <NavDrawer isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </nav>
  );
}
