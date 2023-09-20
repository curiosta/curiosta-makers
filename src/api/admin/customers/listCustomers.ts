import medusa from "@api/medusa";
import { AdminGetCustomersParams } from "@medusajs/medusa";
export const adminCustomersList = async ({
  offset,
  limit,
}: AdminGetCustomersParams) => {
  return medusa.admin.customers.list({ offset, limit });
};
