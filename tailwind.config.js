/**
 * Tailwind is mapped onto the Curiosta shared tokens defined as :root vars in
 * src/index.css. No hex values here: every colour resolves to var(--token), so
 * there is one palette. Opacity modifiers (bg-sea-900/40) use color-mix().
 */
const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined || opacityValue === "1"
    ? `var(--${name})`
    : `color-mix(in srgb, var(--${name}) calc(${opacityValue} * 100%), transparent)`;

const names = [
  "ink", "ink-2", "muted",
  "sea-900", "sea-800", "sea-700", "sea-500",
  "teal", "teal-soft", "coral", "coral-soft",
  "sand", "card", "line", "ok", "bad",
];

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Replace (not extend) the default palette so only brand tokens exist.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      white: "#fff",
      ...Object.fromEntries(names.map((n) => [n, token(n)])),
    },
    fontFamily: {
      sans: "var(--sans)",
      serif: "var(--serif)",
      mono: "var(--mono)",
    },
    // Defaults used by bare `border` / `ring` / `divide-y` classes.
    borderColor: ({ theme }) => ({ ...theme("colors"), DEFAULT: "var(--line)" }),
    ringColor: ({ theme }) => ({ ...theme("colors"), DEFAULT: "var(--sea-500)" }),
    extend: {
      borderRadius: { brand: "var(--radius)" },
      boxShadow: { brand: "var(--shadow)" },
      spacing: { nav: "var(--nav-h)", "bottom-nav": "var(--mms-bottom-nav-h)" },
      fontSize: { base: ["var(--mms-body-size)", { lineHeight: "1.62" }] },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
