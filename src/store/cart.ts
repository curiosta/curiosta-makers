import { signal } from "@preact/signals";

type Cart = {
  method: "issue" | "borrow";
  items: {
    title: string;
    description: string | null;
    thumbnail: string | null;
    quantity: number;
  }[];
}[];

export const cart = signal<Cart>([]);
