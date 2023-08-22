import medusa from "@api/medusa";

export const adminCompleteOrder = async (id: string) => {
  return medusa.admin.orders.complete(id);
};
