/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#0a0a0f",
        surface:  "#0f0f17",
        elevated: "#13131e",
        border:   "#1a1a2e",
        accent:   "#6366f1",
        "accent-hover": "#4f46e5",
        "accent-dim": "rgba(99,102,241,0.125)",
        success:  "#22c55e",
        "success-dim": "rgba(34,197,94,0.094)",
        danger:   "#ef4444",
        "danger-dim": "rgba(239,68,68,0.094)",
        warning:  "#f59e0b",
        "warning-dim": "rgba(245,158,11,0.094)",
        muted:    "#8888aa",
        "text-muted": "#44445a",
        "text-primary": "#f0f0ff",
        "text-secondary": "#8888aa",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans:    ["DM Sans", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      animation: {
        shimmer:      "shimmer 1.5s infinite",
        "flash-green":"flash-green 1.5s ease-out",
        "flash-red":  "flash-red 1.5s ease-out",
        "spin-slow":  "spin 0.8s linear infinite",
        "pulse-dot":  "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      borderRadius: {
        "card": "12px",
        "input": "8px",
        "badge": "6px",
        "btn": "8px",
      },
    },
  },
  plugins: [],
};
