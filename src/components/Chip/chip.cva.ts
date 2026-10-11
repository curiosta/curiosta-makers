import { cva } from "class-variance-authority";

const chip = cva(
  "relative rounded-full px-3 py-1.5 font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: [
          "bg-sea-500",
          "text-white",
          "hover:bg-sea-700",
        ],
        default: ["bg-sand", "text-ink", "hover:bg-sand"],
        primary2: [
          "bg-teal-soft",
          "text-sea-500",
          "text-sm",
          "font-medium",
          "flex items-center justify-center",
          "rounded-md",
          "p-0",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default chip;
