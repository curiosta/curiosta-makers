import type { StoreGetCustomersCustomerOrdersParams } from "@medusajs/medusa";
import medusa from "@/api/medusa";

export const ordersList = async ({
  limit,
  offset,
}: StoreGetCustomersCustomerOrdersParams) => {
  return medusa.customers.listOrders({
    limit,
    offset,
    expand: "items,returns",
  });
};
