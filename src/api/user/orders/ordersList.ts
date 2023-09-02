import Medusa from "@medusajs/medusa-js";

import type { StoreGetCustomersCustomerOrdersParams } from "@medusajs/medusa";

export const ordersList = async ({
  limit,
  offset,
}: StoreGetCustomersCustomerOrdersParams) => {
  const medusa = new Medusa({
    baseUrl: import.meta.env.VITE_PUBLIC_BASE_URL,
    maxRetries: 3,
    apiKey: import.meta.env.VITE_PRIVATE_API_TOKEN,
  });

  return medusa.admin.orders.list({ limit, offset, expand: "items,returns" });
};
