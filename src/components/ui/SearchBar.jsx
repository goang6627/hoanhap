import { useState, useCallback } from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import Icon from "./Icon";

/**
 * SearchBar — Hero search bar with suggestions
 *
 * Accessibility:
 *  - <label> linked to input via htmlFor/id
 *  - sr-only label for screen readers
 *  - Search icon is decorative (aria-hidden)
 *  - Submit button with clear text
 *  - Quick suggestion tags as accessible links
 *
 * @param {Function} onSearch - Callback with search query string
 */

const SUGGESTIONS = [
  { label: "Cấp thẻ NKT", query: "Cấp thẻ NKT" },
  { label: "Việc làm tại nhà", query: "Việc làm tại nhà" },
  { label: "Hỗ trợ pháp lý", query: "Hỗ trợ pháp lý" },
];

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const { state, speakText } = useAccessibility();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch?.(query.trim());
        if (state.screenReader) {
          speakText(`Đang tìm kiếm: ${query.trim()}`);
        }
      }
    },
    [query, onSearch, state.screenReader, speakText]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      setQuery(suggestion);
      onSearch?.(suggestion);
      if (state.screenReader) {
        speakText(`Đang tìm kiếm: ${suggestion}`);
      }
    },
    [onSearch, state.screenReader, speakText]
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSubmit} role="search" className="relative group">
        <label htmlFor="main-search" className="sr-only">
          Tìm kiếm thông tin, dịch vụ
        </label>

        {/* Search icon (decorative) */}
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Icon
            name="search"
            className="text-primary group-focus-within:text-on-primary-fixed transition-colors"
            size="text-2xl"
          />
        </div>

        {/* Text input */}
        <input
          id="main-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm nhanh dịch vụ, chính sách, việc làm..."
          className="block w-full pl-16 pr-6 md:pr-36 py-5 md:py-6
                     border-2 border-outline-variant rounded-xl
                     leading-5 bg-surface dark:bg-inverse-surface dark:text-inverse-on-surface
                     placeholder-on-surface-variant
                     focus:outline-none focus:ring-4 focus:ring-primary focus:border-primary
                     text-body-lg text-on-surface
                     shadow-md transition-all theme-transition"
          autoComplete="off"
        />

        {/* Submit button (hidden on very small screens) */}
        <button
          type="submit"
          className="absolute inset-y-2 right-2 px-6
                     bg-primary text-on-primary font-bold text-label-lg
                     rounded-lg
                     hover:bg-primary-container hover:text-on-primary-container
                     transition-colors
                     focus-visible:ring-4 focus-visible:ring-primary-container
                     hidden sm:block"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Quick Suggestion Tags */}
      <div
        className="flex flex-wrap justify-center gap-3 mt-6"
        role="list"
        aria-label="Gợi ý tìm kiếm"
      >
        <span className="text-sm font-semibold text-on-surface-variant dark:text-surface-dim">
          Gợi ý:
        </span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            role="listitem"
            onClick={() => handleSuggestionClick(item.query)}
            className="text-sm font-semibold text-primary dark:text-inverse-primary
                       hover:underline
                       focus-visible:ring-2 focus-visible:ring-primary
                       rounded px-2 py-1 transition-colors
                       hover:bg-primary-fixed/50"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
