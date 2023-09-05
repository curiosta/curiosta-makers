import medusa from "@api/medusa";

export type TShortItem = {
  item_id: string;
  quantity: number;
};
export const adminUpdateItemsQty = async (
  orderId: string,
  items: TShortItem[]
) => {
  return medusa.admin.orders.update(orderId, { items });
};
