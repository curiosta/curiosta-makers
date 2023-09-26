import medusa from "@api/medusa";
import { AdminGetCustomersParams } from "@medusajs/medusa";
export const adminCustomersList = async ({
  q,
  offset,
  limit,
}: AdminGetCustomersParams) => {
  return medusa.admin.customers.list({ q, offset, limit });
};
