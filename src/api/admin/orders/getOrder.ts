import medusa from "@api/medusa";

export const adminGetOrders = async (id: string) => {
  return medusa.admin.orders.retrieve(id);
};
