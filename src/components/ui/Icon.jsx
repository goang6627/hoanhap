import { useAccessibility } from "../../contexts/AccessibilityContext";

/**
 * Icon — Wrapper for Google Material Symbols Outlined
 *
 * Renders a Material Symbol with proper accessibility attributes.
 * Icons are decorative by default (aria-hidden="true").
 *
 * @param {string}  name      - Material Symbol name (e.g. "volume_up")
 * @param {boolean} filled    - Use filled variant
 * @param {string}  className - Additional CSS classes
 * @param {string}  size      - Tailwind text size class (default: "text-2xl")
 * @param {string}  label     - If provided, icon becomes accessible with this aria-label
 */
export default function Icon({
  name,
  filled = false,
  className = "",
  size = "text-2xl",
  label,
  ...rest
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "fill" : ""} ${size} ${className}`}
      aria-hidden={label ? "false" : "true"}
      aria-label={label || undefined}
      role={label ? "img" : undefined}
      {...rest}
    >
      {name}
    </span>
  );
}
