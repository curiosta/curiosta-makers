import { cva } from "class-variance-authority";

/**
 * Brand buttons (Curiosta skill): primary = coral pill with --sea-900 text
 * (white on coral fails AA); secondary = ghost; danger keeps --bad.
 */
const button = cva(
  "inline-flex justify-center items-center rounded-full text-sm font-semibold transition-[filter,background-color,color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary: [
          "bg-coral",
          "text-sea-900",
          "shadow-sm",
          "hover:brightness-95",
          "focus:brightness-95",
          "disabled:opacity-60",
          "disabled:pointer-events-none",
          "disabled:select-none",
          "focus-visible:outline-sea-900",
          "py-3 px-5 w-fit",
        ],
        secondary: [
          "bg-card",
          "text-sea-900",
          "border border-sea-500",
          "hover:bg-teal-soft",
          "active:bg-teal-soft",
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-sea-500",
          "focus-visible:ring-offset-2",
          "disabled:opacity-60",
          "px-4 py-2 w-fit",
        ],
        dropDown: [
          "bg-card",
          "hover:bg-sand",
          "disabled:opacity-60",
          "text-ink-2",
          "rounded-md",
          "px-4 py-2 w-full",
        ],
        danger: [
          "bg-bad",
          "text-white",
          "shadow-sm",
          "hover:brightness-95",
          "disabled:opacity-60",
          "focus-visible:outline-bad",
          "py-3 px-5 w-fit",
        ],
        icon: ["p-2 rounded-md"],
        "icon-active": [
          "bg-sea-700",
          "text-white",
          "fill-white",
          "rounded-md",
          "p-2 w-max items-center justify-center flex",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export default button;
