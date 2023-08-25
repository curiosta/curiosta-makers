import medusa from "@api/medusa";

export const getOrders = async (orderId: string) => {
  return medusa.orders.retrieve(orderId, { expand: "returns" });
};
