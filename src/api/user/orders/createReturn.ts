import medusa from "@api/medusa";

export type TReturnItem = {
  item_id: string;
  quantity: number;
};
export const createReturn = async (orderId: string, items: TReturnItem[]) => {
  return medusa.returns.create({ order_id: orderId, items });
};
