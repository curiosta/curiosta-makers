import medusa from "@api/medusa";

type shortItem = {
  item_id: string;
  quantity: number;
};
export const adminUpdateItemsQty = async (
  orderId: string,
  items: shortItem[]
) => {
  return medusa.admin.orders.update(orderId, { items });
};
