import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import Icon from "../ui/Icon";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Header — Sticky top app bar with navigation
 *
 * Features:
 *  - Logo + brand text linking to /
 *  - Desktop navigation: Quyền lợi, Trợ cấp, Bản đồ hỗ trợ, Tin tức
 *  - Action buttons: Language, Notifications, Đăng nhập
 *  - Mobile hamburger menu with slide-down panel
 *  - Semantic <header> + <nav> with aria-labels
 *  - All interactive elements have focus-visible rings
 */

const NAV_ITEMS = [
  { to: "/quyen-loi", label: "Quyền lợi" },
  { to: "/ket-noi", label: "Kết nối" },
  { to: "/ban-do", label: "Bản đồ hỗ trợ" },
  { to: "/tin-tuc", label: "Tin tức" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Close profile dropdown on Escape keypress
  useEffect(() => {
    if (!profileOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setProfileOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [profileOpen]);

  return (
    <header
      className="bg-surface dark:bg-tertiary border-b-2 border-outline-variant
                 dark:border-outline w-full sticky top-0 z-40 theme-transition"
    >
      <div className="flex justify-between items-center px-4 md:px-margin-desktop py-4 w-full max-w-[1440px] mx-auto">
        {/* ── Logo & Brand ── */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            aria-label="Trang chủ Hoà Nhập"
            className="flex items-center gap-2 focus-visible:ring-4 focus-visible:ring-primary
                       rounded-lg p-1 transition-transform hover:scale-[1.02]"
          >
            <Icon name="diversity_1" filled size="text-4xl" className="text-primary dark:text-inverse-primary" />
            <span className="font-bold text-headline-md text-primary dark:text-inverse-primary hidden sm:block">
              Hoà Nhập
            </span>
          </Link>
        </div>

        {/* ── Desktop Navigation ── */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex gap-2 lg:gap-6 items-center">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-semibold text-label-lg px-3 py-2 rounded-lg
                 transition-all duration-150 active:scale-95
                 focus-visible:ring-4 focus-visible:ring-primary
                 ${
                   isActive
                     ? "text-primary bg-primary-fixed dark:bg-on-primary-fixed-variant dark:text-primary-fixed"
                     : "text-on-surface-variant dark:text-tertiary-fixed-dim hover:text-primary hover:bg-surface-variant dark:hover:bg-tertiary-container"
                 }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language button (desktop) */}
          <button
            aria-label="Ngôn ngữ"
            className="hidden lg:flex p-2 text-on-surface-variant dark:text-tertiary-fixed-dim
                       hover:bg-surface-variant dark:hover:bg-tertiary-container
                       rounded-full transition-colors
                       focus-visible:ring-4 focus-visible:ring-primary active:scale-95
                       min-w-[48px] min-h-[48px] items-center justify-center"
          >
            <Icon name="language" />
          </button>

          {/* Notifications button (desktop) */}
          <button
            aria-label="Thông báo"
            className="hidden lg:flex p-2 text-on-surface-variant dark:text-tertiary-fixed-dim
                       hover:bg-surface-variant dark:hover:bg-tertiary-container
                       rounded-full transition-colors
                       focus-visible:ring-4 focus-visible:ring-primary active:scale-95
                       min-w-[48px] min-h-[48px] items-center justify-center"
          >
            <Icon name="notifications" />
          </button>

          {/* Profile Dropdown or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label={`Tài khoản của ${user.fullName}`}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold text-label-lg
                           flex items-center justify-center transition-all duration-150 active:scale-95
                           hover:bg-primary-container hover:text-on-primary-container focus-visible:ring-4 focus-visible:ring-primary shadow-sm"
              >
                {user.fullName ? user.fullName.split(" ").pop().charAt(0).toUpperCase() : "U"}
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-surface dark:bg-tertiary-container
                             border-2 border-outline-variant dark:border-outline rounded-xl shadow-lg py-2 z-50
                             animate-[slideUp_0.15s_ease-out]"
                  role="menu"
                  aria-label="Menu tài khoản cá nhân"
                >
                  <div className="px-4 py-2 border-b border-outline-variant/50 text-sm">
                    <p className="text-on-surface-variant font-medium dark:text-tertiary-fixed-dim">Xin chào,</p>
                    <p className="font-bold text-on-surface truncate dark:text-on-tertiary-container">{user.fullName}</p>
                  </div>
                  
                  <Link
                    to="/ho-so"
                    onClick={() => setProfileOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant dark:text-tertiary-fixed-dim
                               hover:bg-surface-variant dark:hover:bg-tertiary/20 transition-colors"
                  >
                    <Icon name="person" size="text-lg" />
                    Hồ sơ cá nhân
                  </Link>

                  <Link
                    to="/ho-so#saved"
                    onClick={() => setProfileOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant dark:text-tertiary-fixed-dim
                               hover:bg-surface-variant dark:hover:bg-tertiary/20 transition-colors"
                  >
                    <Icon name="bookmark" size="text-lg" />
                    Quyền lợi đã lưu
                  </Link>
                  
                  <hr className="border-outline-variant/50 my-1" />
                  
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/20 transition-colors"
                  >
                    <Icon name="logout" size="text-lg" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/dang-nhap"
              className="bg-primary text-on-primary font-bold text-label-lg
                         px-4 md:px-6 py-3 rounded-lg
                         hover:bg-primary-container hover:text-on-primary-container
                         transition-all min-h-[48px]
                         focus-visible:ring-4 focus-visible:ring-primary-container
                         active:scale-95 shadow-sm
                         inline-flex items-center gap-2"
            >
              <Icon name="login" size="text-xl" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu điều hướng"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            className="md:hidden p-2 text-on-surface-variant
                       hover:bg-surface-variant rounded-lg transition-colors
                       focus-visible:ring-4 focus-visible:ring-primary
                       min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size="text-3xl" />
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Menu ── */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Menu điều hướng di động"
          className="md:hidden border-t-2 border-outline-variant dark:border-outline
                     bg-surface dark:bg-tertiary
                     px-4 py-4 space-y-2
                     animate-[slideUp_0.2s_ease-out]"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block font-semibold text-label-lg px-4 py-3 rounded-lg
                 transition-colors min-h-[48px]
                 focus-visible:ring-4 focus-visible:ring-primary
                 ${
                   isActive
                     ? "text-primary bg-primary-fixed"
                     : "text-on-surface-variant hover:text-primary hover:bg-surface-variant"
                 }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Mobile-only: Language & Notifications */}
          <div className="flex gap-2 pt-2 border-t border-outline-variant">
            <button
              aria-label="Ngôn ngữ"
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg
                         text-on-surface-variant hover:bg-surface-variant
                         transition-colors focus-visible:ring-4 focus-visible:ring-primary
                         min-h-[48px]"
            >
              <Icon name="language" />
              <span className="text-sm font-medium">Ngôn ngữ</span>
            </button>
            <button
              aria-label="Thông báo"
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg
                         text-on-surface-variant hover:bg-surface-variant
                         transition-colors focus-visible:ring-4 focus-visible:ring-primary
                         min-h-[48px]"
            >
              <Icon name="notifications" />
              <span className="text-sm font-medium">Thông báo</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
