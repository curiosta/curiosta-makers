import medusa from "@api/medusa";
import type { AdminGetOrdersParams } from "@medusajs/medusa";

export const adminOrdersList = async ({
  limit,
  offset,
}: AdminGetOrdersParams) => {
  return medusa.admin.orders.list({ limit, offset, expand: "items" });
};
