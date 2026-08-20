import clsx from "clsx";
import styles from "./Button.module.css";

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button className={clsx(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
