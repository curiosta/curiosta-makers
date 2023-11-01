import { Customer } from "@medusajs/medusa";
import { signal } from "@preact/signals";

export type TDraftOrderItems = {
  quantity: number;
  product_id: string;
  variant_id: string;
  inventoryQty: number;
  title: string;
  thumbnail: string | null;
  metadata: { cartType: string; borrowReturnDate?: string };
};
const draftUser: Customer = JSON.parse(localStorage.getItem("draftUser"));
const draftOrderItem: TDraftOrderItems[] = JSON.parse(
  localStorage.getItem("draftOrderItems")
);

export const selectedUser = signal<Customer | null>(draftUser ?? null);
export const draftOrderItems = signal<TDraftOrderItems[]>(draftOrderItem ?? []);
