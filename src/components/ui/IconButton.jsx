import clsx from "clsx";
import styles from "./IconButton.module.css";

export function IconButton({ icon: Icon, label, variant = "default", className, iconProps, ...props }) {
  return (
    <button className={clsx(styles.iconButton, styles[variant], className)} aria-label={label} title={label} {...props}>
      <Icon size={20} strokeWidth={1.75} {...iconProps} />
    </button>
  );
}
