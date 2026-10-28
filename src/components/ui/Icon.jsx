import { ICONS } from "../../config/icons.js";

export function Icon({ name, size = 20, stroke = "var(--icon)", strokeWidth = 1.5, fill = "none", className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none", ...style }}
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
