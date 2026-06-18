import { Link } from "react-router-dom";

/**
 * ServiceCard — Premium bento grid card for homepage services
 *
 * Displays a service with image, title, description, and "Xem chi tiết" link.
 *
 * Accessibility:
 *  - Entire card is a link (<a>) with descriptive aria-label
 *  - Group hover transitions for visual feedback
 *  - Focus-visible ring on the card
 *  - Animated gradient top border on hover
 *
 * @param {string} to           - Route path
 * @param {string} title        - Card title (Vietnamese)
 * @param {string} description  - Card description
 * @param {string} ariaLabel    - Full accessible label
 * @param {string} imageSrc     - Decorative service image URL
 */
export default function ServiceCard({
  to,
  title,
  description,
  ariaLabel,
  imageSrc,
}) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel || `${title}: ${description}`}
      className="service-card glass-card group
                 rounded-2xl p-8 flex flex-col items-start gap-6
                 relative overflow-hidden h-full
                 transition-all duration-300
                 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest
                 theme-transition hover:-translate-y-1"
    >
      {imageSrc && (
        <div
          className="relative z-10 aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-container dark:bg-tertiary"
          aria-hidden="true"
        >
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Text content */}
      <div className="space-y-3 relative z-10">
        <h3
          className="text-headline-md text-on-surface dark:text-inverse-on-surface
                     group-hover:text-primary dark:group-hover:text-inverse-primary
                     transition-colors duration-300 font-bold"
        >
          {title}
        </h3>
        <p className="text-body-md text-on-surface-variant dark:text-surface-dim leading-relaxed">
          {description}
        </p>
      </div>

      {/* "View details" link indicator */}
      <div
        className="mt-auto pt-4 flex items-center gap-2
                   text-primary dark:text-inverse-primary
                   font-semibold text-label-lg
                   group-hover:gap-3 transition-all duration-300 relative z-10"
      >
        <span>Xem chi tiết</span>
      </div>
    </Link>
  );
}
