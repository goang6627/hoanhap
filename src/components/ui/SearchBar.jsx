import { useState, useCallback } from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Icon from "./Icon";

const SUGGESTIONS = [
  { labelKey: "suggestion_tag_nkt", query: "Cấp thẻ NKT", icon: "badge" },
  { labelKey: "suggestion_tag_work", query: "Việc làm tại nhà", icon: "work" },
  { labelKey: "suggestion_tag_legal", query: "Hỗ trợ pháp lý", icon: "gavel" },
];

export default function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState("");
  const { state, speakText } = useAccessibility();
  const { t } = useLanguage();

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
      <form onSubmit={handleSubmit} role="search" className="relative group search-glow rounded-2xl transition-all duration-300">
        <label htmlFor="main-search" className="sr-only">
          {t("search_input_label")}
        </label>

        {/* Search icon (decorative) */}
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Icon
            name="search"
            className="text-on-surface-variant/50 group-focus-within:text-primary transition-colors duration-300"
            size="text-2xl"
          />
        </div>

        {/* Text input */}
        <input
          id="main-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t("search_placeholder")}
          className="block w-full pl-16 pr-6 md:pr-40 py-5 md:py-6
                     border border-outline-variant/50 rounded-2xl
                     leading-5 bg-surface-container-lowest dark:bg-inverse-surface
                     dark:text-inverse-on-surface
                     placeholder-on-surface-variant/60
                     focus:outline-none focus:border-primary/50
                     text-body-lg text-on-surface
                     shadow-lg shadow-primary/[0.03]
                     transition-all duration-300 theme-transition"
          autoComplete="off"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="absolute inset-y-2.5 right-2.5 px-7
                     bg-primary text-on-primary font-bold text-label-lg
                     rounded-xl
                     hover:bg-primary-container hover:text-on-primary
                     transition-all duration-200
                     focus-visible:ring-4 focus-visible:ring-primary-container
                     hidden sm:flex items-center gap-2
                     active:scale-95 shadow-md"
        >
          <Icon name="search" size="text-lg" />
          {t("search_button")}
        </button>
      </form>

      {/* Quick Suggestion Tags */}
      <div
        className="flex flex-wrap justify-center gap-3 mt-6"
        aria-label={t("search_suggestions_label")}
      >
        <span className="text-sm font-semibold text-on-surface-variant/70 dark:text-surface-dim
                         flex items-center gap-1">
          <Icon name="trending_up" size="text-base" />
          {t("search_popular_prefix")}
        </span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item.labelKey}
            onClick={() => handleSuggestionClick(item.query)}
            aria-label={`${t("search_button")}: ${t(item.labelKey)}`}
            className="suggestion-chip text-sm font-semibold text-primary dark:text-inverse-primary
                       bg-primary/5 dark:bg-primary/10
                       hover:bg-primary/10 dark:hover:bg-primary/20
                       focus-visible:ring-2 focus-visible:ring-primary
                       rounded-full px-4 py-2 transition-all duration-200
                       flex items-center gap-1.5
                       border border-primary/10 dark:border-primary/20"
          >
            <Icon name={item.icon} size="text-sm" />
            {t(item.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
