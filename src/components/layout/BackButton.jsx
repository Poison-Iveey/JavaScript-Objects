import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Icon } from "../ui/Icon.jsx";
import styles from "./BackButton.module.css";

// In-app "Back": returns to the previous page of this visit. When the page was
// opened directly (nothing earlier in the app's history) it goes to `fallback`
// instead, or hides itself when there is no fallback.
export function BackButton({ fallback = "/dashboard", className }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // React Router stores the position in its history stack as `idx`.
  const canGoBack = (window.history.state?.idx ?? 0) > 0;
  const target = canGoBack ? null : fallback && fallback !== pathname ? fallback : null;

  if (!canGoBack && !target) return null;

  return (
    <button
      type="button"
      className={clsx(styles.back, className)}
      onClick={() => (canGoBack ? navigate(-1) : navigate(target))}
    >
      <Icon name="left" size={15} stroke="currentColor" strokeWidth={1.8} />
      Back
    </button>
  );
}
