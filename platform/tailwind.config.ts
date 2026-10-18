import type { Config } from "tailwindcss";

/**
 * Tailwind читает значения только из дизайн-токенов (src/styles/tokens.css).
 * Цвета, шрифты и длительности анимаций не задаются в компонентах напрямую.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: {
        DEFAULT: "var(--color-bg)",
        surface: "var(--color-surface)",
        elevated: "var(--color-elevated)",
      },
      line: {
        DEFAULT: "var(--color-line)",
        strong: "var(--color-line-strong)",
      },
      fg: {
        DEFAULT: "var(--color-fg)",
        muted: "var(--color-fg-muted)",
        subtle: "var(--color-fg-subtle)",
        inverse: "var(--color-fg-inverse)",
      },
      accent: {
        DEFAULT: "var(--color-accent)",
        hover: "var(--color-accent-hover)",
        soft: "var(--color-accent-soft)",
      },
      magenta: {
        DEFAULT: "var(--color-magenta)",
        soft: "var(--color-magenta-soft)",
      },
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      danger: "var(--color-danger)",
    },
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "monospace"],
    },
    borderRadius: {
      none: "0",
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      full: "9999px",
    },
    // Только микро-переходы 150–250 мс (см. docs/DESIGN_SYSTEM.md)
    transitionDuration: {
      DEFAULT: "var(--duration-base)",
      fast: "var(--duration-fast)",
      base: "var(--duration-base)",
      slow: "var(--duration-slow)",
    },
    transitionTimingFunction: {
      DEFAULT: "var(--ease-out)",
      out: "var(--ease-out)",
    },
    // pulse / ping / bounce отключены намеренно: никакого мерцания на контенте
    animation: {
      none: "none",
      spin: "spin 1s linear infinite",
    },
    extend: {
      maxWidth: {
        prose: "72ch",
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
