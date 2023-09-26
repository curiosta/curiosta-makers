import medusa from "@api/medusa";
import type { AdminGetOrdersParams } from "@medusajs/medusa";

export const adminOrdersList = async ({
  q,
  limit,
  offset,
  payment_status,
  fulfillment_status,
}: AdminGetOrdersParams) => {
  return medusa.admin.orders.list({
    q,
    payment_status,
    fulfillment_status,
    limit,
    offset,
    expand: "items,returns",
  });
};
