const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.teal,
        danger: colors.red,
        secondray: colors.white,
        success: colors.green,
      },
      textColor: {
        primary: colors.gray,
        "app-primary": colors.teal,
        disabled: colors.gray[400],
        success: colors.green,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
