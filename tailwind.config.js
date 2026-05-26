/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      /* ─── Phổ Nghi Color Palette (38 tokens) ─── */
      colors: {
        surface:                    "#fcf9f8",
        "surface-dim":              "#dcd9d9",
        "surface-bright":           "#fcf9f8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low":    "#f6f3f2",
        "surface-container":        "#f0edec",
        "surface-container-high":   "#ebe7e7",
        "surface-container-highest":"#e5e2e1",
        "on-surface":               "#1c1b1b",
        "on-surface-variant":       "#434651",
        "inverse-surface":          "#313030",
        "inverse-on-surface":       "#f3f0ef",
        outline:                    "#747782",
        "outline-variant":          "#c4c6d2",
        "surface-tint":             "#395ca5",
        primary:                    "#002b6b",
        "on-primary":               "#ffffff",
        "primary-container":        "#1a428a",
        "on-primary-container":     "#91b1ff",
        "inverse-primary":          "#b0c6ff",
        secondary:                  "#bb000f",
        "on-secondary":             "#ffffff",
        "secondary-container":      "#e32322",
        "on-secondary-container":   "#fffbff",
        tertiary:                   "#2c2f30",
        "on-tertiary":              "#ffffff",
        "tertiary-container":       "#434546",
        "on-tertiary-container":    "#b1b3b4",
        error:                      "#ba1a1a",
        "on-error":                 "#ffffff",
        "error-container":          "#ffdad6",
        "on-error-container":       "#93000a",
        "primary-fixed":            "#d9e2ff",
        "primary-fixed-dim":        "#b0c6ff",
        "on-primary-fixed":         "#001944",
        "on-primary-fixed-variant": "#1c448c",
        "secondary-fixed":          "#ffdad5",
        "secondary-fixed-dim":      "#ffb4aa",
        "on-secondary-fixed":       "#410002",
        "on-secondary-fixed-variant":"#930009",
        "tertiary-fixed":           "#e1e3e4",
        "tertiary-fixed-dim":       "#c5c7c8",
        "on-tertiary-fixed":        "#191c1d",
        "on-tertiary-fixed-variant":"#454748",
        background:                 "#fcf9f8",
        "on-background":            "#1c1b1b",
        "surface-variant":          "#e5e2e1",
      },

      /* ─── Border Radius (from DESIGN.md rounded) ─── */
      borderRadius: {
        sm:      "0.25rem",
        DEFAULT: "0.5rem",
        md:      "0.75rem",
        lg:      "1rem",
        xl:      "1.5rem",
        full:    "9999px",
      },

      /* ─── Spacing (touch targets, gutters, margins, sidebar) ─── */
      spacing: {
        "touch-target-min": "48px",
        gutter:             "24px",
        "margin-mobile":    "16px",
        "margin-desktop":   "40px",
        "sidebar-width":    "80px",
      },

      /* ─── Typography — Be Vietnam Pro ─── */
      fontFamily: {
        "headline-xl":        ["Be Vietnam Pro", "sans-serif"],
        "headline-lg":        ["Be Vietnam Pro", "sans-serif"],
        "headline-lg-mobile": ["Be Vietnam Pro", "sans-serif"],
        "headline-md":        ["Be Vietnam Pro", "sans-serif"],
        "body-lg":            ["Be Vietnam Pro", "sans-serif"],
        "body-md":            ["Be Vietnam Pro", "sans-serif"],
        "label-lg":           ["Be Vietnam Pro", "sans-serif"],
        sans:                 ["Be Vietnam Pro", "sans-serif"],
      },

      fontSize: {
        "headline-xl": [
          "48px",
          { lineHeight: "60px", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", fontWeight: "700" },
        ],
        "headline-lg-mobile": [
          "28px",
          { lineHeight: "36px", fontWeight: "700" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "32px", fontWeight: "700" },
        ],
        "body-lg": [
          "20px",
          { lineHeight: "30px", fontWeight: "400" },
        ],
        "body-md": [
          "18px",
          { lineHeight: "28px", fontWeight: "400" },
        ],
        "label-lg": [
          "16px",
          { lineHeight: "24px", fontWeight: "600" },
        ],
      },

      /* ─── Minimum height for accessible buttons ─── */
      minHeight: {
        "btn":   "48px",
        "btn-lg":"56px",
      },
    },
  },
  plugins: [],
};
