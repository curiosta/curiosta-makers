import { TCustomer } from "@/api/user";
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
const draftUser: TCustomer = JSON.parse(localStorage.getItem("draftUser"));
const draftOrderItem: TDraftOrderItems[] = JSON.parse(
  localStorage.getItem("draftOrderItems")
);

export const selectedUser = signal<TCustomer | null>(draftUser ?? null);
export const draftOrderItems = signal<TDraftOrderItems[]>(draftOrderItem ?? []);
