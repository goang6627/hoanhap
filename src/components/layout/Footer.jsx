import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

/**
 * Footer — Site footer with brand info and navigation links
 *
 * Accessibility:
 *  - Semantic <footer> element
 *  - aria-label on footer nav
 *  - All links have focus-visible rings
 *  - Responsive: stacks vertically on mobile
 */

const FOOTER_LINKS = [
  { to: "/ve-chung-toi", label: "Về chúng tôi" },
  { to: "/dieu-khoan", label: "Điều khoản sử dụng" },
  { to: "/bao-mat", label: "Chính sách bảo mật" },
  { to: "/lien-he", label: "Liên hệ" },
];

export default function Footer() {
  return (
    <footer
      className="bg-tertiary dark:bg-on-tertiary-fixed text-tertiary-fixed
                 dark:text-tertiary-fixed-dim border-t-4 border-secondary
                 w-full mt-auto theme-transition"
    >
      <div
        className="flex flex-col md:flex-row justify-between items-center
                   px-4 md:px-margin-desktop py-10 md:py-12
                   max-w-[1440px] mx-auto gap-8"
      >
        {/* ── Brand & Copyright ── */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <div className="text-headline-md text-on-tertiary mb-2 font-bold flex items-center gap-2">
            <Icon name="diversity_1" />
            Hoà Nhập
          </div>
          <p className="text-body-md text-on-tertiary-container max-w-md">
            © {new Date().getFullYear()} Cổng thông tin hỗ trợ người khuyết tật
            Việt Nam. Mọi quyền được bảo lưu.
          </p>
        </div>

        {/* ── Footer Navigation ── */}
        <nav
          aria-label="Liên kết chân trang"
          className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-body-md text-tertiary-fixed
                         hover:text-white hover:underline
                         transition-all
                         focus-visible:ring-2 focus-visible:ring-primary
                         rounded p-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
