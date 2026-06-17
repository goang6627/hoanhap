import { useState } from "react";
import Icon from "../ui/Icon";

/**
 * ChatbotFAB — Floating Action Button for the chatbot
 *
 * Fixed in the bottom-right corner (z-50).
 * Shows a tooltip on hover.
 * Phase 4 will expand this into a full chatbot panel.
 *
 * Accessibility:
 *  - aria-label describes the button purpose
 *  - min 48px touch target (actual: 64px)
 *  - Focus-visible ring
 */
export default function ChatbotFAB() {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
      {/* Tooltip */}
      <span
        className={`absolute -top-12 right-0 bg-surface text-on-surface
                    font-semibold text-sm py-2 px-4 rounded-lg shadow-lg
                    border border-outline-variant whitespace-nowrap
                    pointer-events-none transition-opacity duration-200
                    ${tooltipVisible ? "opacity-100" : "opacity-0"}`}
        role="tooltip"
        id="chatbot-tooltip"
      >
        Chatbot Hỗ trợ
      </span>

      <button
        aria-label="Mở Chatbot Hỗ trợ"
        aria-describedby="chatbot-tooltip"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        className="w-16 h-16 bg-primary text-on-primary rounded-full
                   shadow-xl flex items-center justify-center
                   hover:bg-primary-container hover:text-on-primary
                   hover:scale-105
                   transition-all duration-200
                   focus-visible:ring-4 focus-visible:ring-primary-container
                   border-2 border-white/20
                   active:scale-95"
      >
        <Icon name="chat" size="text-3xl" />
      </button>
    </div>
  );
}
