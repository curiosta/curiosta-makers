import { cva } from "class-variance-authority";

const typography = cva("", {
  variants: {
    variant: {
      primary: ["text-ink"],
      secondary: ["text-ink-2"],
      button: ["text-sea-900 font-semibold"],
      error: ["text-sm text-bad"],
      "app-primary": ["text-sea-500"],
      success: ["text-ok"],
    },
    size: {
      h1: "text-6xl font-serif",
      h2: "text-5xl font-serif",
      h3: "text-4xl font-serif",
      h4: "text-3xl font-serif",
      h5: "text-2xl font-serif",
      h6: "text-xl font-serif",
      subheading: "text-lg",
      body1: "text-base",
      body2: "text-sm",
      small: "text-xs",
    },
    weight: {
      light: ["font-thin"],
      normal: ["font-normal"],
      medium: ["font-medium"],
      bold: ["font-bold"],
      "semi-bold": ["font-semibold"],
    },
    disabled: {
      true: ["text-muted italic"],
    },
  },
  defaultVariants: {
    size: "body1",
    weight: "normal",
  },
});

export default typography;
