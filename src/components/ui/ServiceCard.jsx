import { Link } from "react-router-dom";
import Icon from "./Icon";

/**
 * ServiceCard — Bento grid card for homepage services
 *
 * Displays a service with icon, title, description, and "Xem chi tiết" link.
 *
 * Accessibility:
 *  - Entire card is a link (<a>) with descriptive aria-label
 *  - Group hover transitions for visual feedback
 *  - Focus-visible ring on the card
 *  - Icon container uses role="presentation"
 *
 * @param {string} to           - Route path
 * @param {string} icon         - Material Symbol name
 * @param {string} title        - Card title (Vietnamese)
 * @param {string} description  - Card description
 * @param {string} ariaLabel    - Full accessible label
 * @param {string} iconBg       - Tailwind bg class for icon container
 * @param {string} iconColor    - Tailwind text class for icon
 * @param {string} iconBorder   - Tailwind border class for icon container
 */
export default function ServiceCard({
  to,
  icon,
  title,
  description,
  ariaLabel,
  iconBg = "bg-primary-fixed",
  iconColor = "text-primary",
  iconBorder = "border-primary-container",
}) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel || `${title}: ${description}`}
      className="service-card group bg-surface dark:bg-inverse-surface
                 border-2 border-outline-variant
                 hover:border-primary dark:hover:border-inverse-primary
                 rounded-xl p-8 flex flex-col items-start gap-6
                 transition-all duration-200
                 hover:shadow-lg
                 focus-visible:ring-4 focus-visible:ring-primary
                 theme-transition"
    >
      {/* Icon container */}
      <div
        className={`w-16 h-16 ${iconBg} ${iconColor} rounded-lg
                    flex items-center justify-center
                    border ${iconBorder}
                    group-hover:scale-110 transition-transform duration-200`}
        role="presentation"
      >
        <Icon name={icon} size="text-4xl" />
      </div>

      {/* Text content */}
      <div>
        <h3
          className="text-headline-md text-on-surface dark:text-inverse-on-surface
                     mb-3 group-hover:text-primary dark:group-hover:text-inverse-primary
                     transition-colors"
        >
          {title}
        </h3>
        <p className="text-body-md text-on-surface-variant dark:text-surface-dim">
          {description}
        </p>
      </div>

      {/* "View details" link indicator */}
      <div
        className="mt-auto pt-4 flex items-center gap-1
                   text-primary dark:text-inverse-primary
                   font-semibold text-label-lg
                   group-hover:gap-2 transition-all duration-200"
      >
        Xem chi tiết
        <Icon name="arrow_forward" size="text-xl" />
      </div>
    </Link>
  );
}
