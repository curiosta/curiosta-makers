import type { StoreGetCustomersCustomerOrdersParams } from "@medusajs/medusa";
import medusa from "@/api/medusa";

export const ordersList = async ({
  limit,
  offset,
  id,
}: StoreGetCustomersCustomerOrdersParams) => {
  return medusa.customers.listOrders({
    id,
    limit,
    offset,
    expand: "items,returns,fulfillments",
  });
};
