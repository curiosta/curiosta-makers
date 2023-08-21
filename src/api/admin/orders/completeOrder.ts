import medusa from "@api/medusa";

export const admincompleteOrders = async (id: string) => {
  return medusa.admin.orders.complete(id);
};
