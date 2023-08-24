import medusa from "@api/medusa";

export const adminCancelOrder = async (id: string) => {
  return medusa.admin.orders.cancel(id);
};
