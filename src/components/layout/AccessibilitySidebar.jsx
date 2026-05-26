import { useState, useCallback, useEffect } from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import Icon from "../ui/Icon";
import SOSModal from "./SOSModal";

/**
 * AccessibilitySidebar — Fixed left toolbar (80px wide)
 *
 * Contains 7 accessibility tool buttons as specified in DESIGN.md:
 * 1. Đọc nội dung (TTS toggle)
 * 2. Tăng chữ (increase font scale)
 * 3. Giảm chữ (decrease font scale)
 * 4. Tương phản (high contrast toggle)
 * 5. Giao diện tối (dark mode toggle)
 * 6. Điều hướng (keyboard nav toggle)
 * 7. SOS (emergency — pinned to bottom)
 *
 * Each button is 64×64px with aria-label and aria-pressed (for toggles).
 * Tab order flows top-to-bottom within the sidebar.
 */

export default function AccessibilitySidebar() {
  const {
    state,
    increaseFontScale,
    decreaseFontScale,
    toggleDarkMode,
    toggleHighContrast,
    toggleScreenReader,
    toggleKeyboardNav,
  } = useAccessibility();

  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for SOS behavior
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSOS = useCallback(() => {
    if (isMobile) {
      // On mobile: directly trigger phone call
      window.location.href = "tel:115";
    } else {
      // On desktop/tablet: show modal
      setSosModalOpen(true);
    }
  }, [isMobile]);

  // Active state styling for toggle buttons
  const activeClasses =
    "bg-primary-container text-primary dark:bg-on-primary-container dark:text-primary-fixed";
  const inactiveClasses =
    "text-on-tertiary-fixed-variant dark:text-tertiary-fixed hover:bg-primary-container dark:hover:bg-on-tertiary-container hover:text-primary";

  return (
    <>
      <aside
        aria-label="Thanh công cụ trợ năng"
        className="accessibility-sidebar fixed left-0 top-0 h-full w-sidebar-width z-50
                   bg-surface-container-highest dark:bg-tertiary
                   border-r-2 border-primary dark:border-outline
                   shadow-lg flex flex-col items-center py-6 space-y-3
                   theme-transition"
      >
        {/* Tool 1: Read Content (TTS) */}
        <button
          onClick={toggleScreenReader}
          aria-label="Đọc nội dung"
          aria-pressed={state.screenReader}
          className={`sidebar-tool-btn group ${
            state.screenReader ? activeClasses : inactiveClasses
          }`}
        >
          <Icon
            name="volume_up"
            size="text-3xl"
            className="group-hover:scale-110 transition-transform"
          />
          <span className="icon-label">
            Đọc
            <br />
            nội dung
          </span>
        </button>

        {/* Tool 2: Increase Font Size */}
        <button
          onClick={increaseFontScale}
          aria-label={`Tăng cỡ chữ. Cỡ chữ hiện tại: ${Math.round(state.fontScale * 100)}%`}
          className={`sidebar-tool-btn group ${inactiveClasses}`}
          disabled={state.fontScale >= 2.0}
        >
          <Icon
            name="text_increase"
            size="text-3xl"
            className="group-hover:scale-110 transition-transform"
          />
          <span className="icon-label">
            Tăng
            <br />
            chữ
          </span>
        </button>

        {/* Tool 3: Decrease Font Size */}
        <button
          onClick={decreaseFontScale}
          aria-label={`Giảm cỡ chữ. Cỡ chữ hiện tại: ${Math.round(state.fontScale * 100)}%`}
          className={`sidebar-tool-btn group ${inactiveClasses}`}
          disabled={state.fontScale <= 0.8}
        >
          <Icon
            name="text_decrease"
            size="text-3xl"
            className="group-hover:scale-110 transition-transform"
          />
          <span className="icon-label">
            Giảm
            <br />
            chữ
          </span>
        </button>

        {/* Tool 4: High Contrast */}
        <button
          onClick={toggleHighContrast}
          aria-label="Tương phản cao"
          aria-pressed={state.highContrast}
          className={`sidebar-tool-btn group ${
            state.highContrast ? activeClasses : inactiveClasses
          }`}
        >
          <Icon
            name="contrast"
            size="text-3xl"
            className="group-hover:scale-110 transition-transform"
          />
          <span className="icon-label">
            Tương
            <br />
            phản
          </span>
        </button>

        {/* Tool 5: Dark Mode */}
        <button
          onClick={toggleDarkMode}
          aria-label="Chế độ tối"
          aria-pressed={state.darkMode}
          className={`sidebar-tool-btn group ${
            state.darkMode ? activeClasses : inactiveClasses
          }`}
        >
          <Icon
            name="dark_mode"
            size="text-3xl"
            className="group-hover:scale-110 transition-transform"
          />
          <span className="icon-label">
            Giao
            <br />
            diện tối
          </span>
        </button>

        {/* Tool 6: Keyboard Navigation */}
        <button
          onClick={toggleKeyboardNav}
          aria-label="Điều hướng bằng bàn phím"
          aria-pressed={state.keyboardNav}
          className={`sidebar-tool-btn group ${
            state.keyboardNav ? activeClasses : inactiveClasses
          }`}
        >
          <Icon
            name="keyboard"
            size="text-3xl"
            className="group-hover:scale-110 transition-transform"
          />
          <span className="icon-label">
            Điều
            <br />
            hướng
          </span>
        </button>

        {/* Spacer — pushes SOS to bottom */}
        <div className="flex-grow" aria-hidden="true" />

        {/* Tool 7: SOS Emergency (pinned to bottom) */}
        <button
          onClick={handleSOS}
          aria-label="SOS Khẩn cấp — Liên hệ đường dây nóng"
          className="sidebar-tool-btn group bg-secondary text-on-secondary
                     hover:bg-secondary-container hover:text-on-secondary-container
                     shadow-md"
        >
          <Icon
            name="sos"
            size="text-3xl"
            className="font-bold group-hover:scale-110 transition-transform"
          />
          <span className="icon-label font-bold">SOS</span>
        </button>
      </aside>

      {/* SOS Modal (desktop only) */}
      <SOSModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />
    </>
  );
}
