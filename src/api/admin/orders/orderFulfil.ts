import medusa from "@api/medusa";

type PickedItem = {
  item_id: string;
  quantity: number;
};
export const adminFulfillment = async (
  orderId: string,
  items: PickedItem[]
) => {
  return medusa.admin.orders.createFulfillment(orderId, { items });
};
