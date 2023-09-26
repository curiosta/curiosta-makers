import medusa from "@/api/medusa";
type TOrderList = {
  limit?: number;
  offset?: number;
  id?: string;
  payment_status?: string[];
  fulfillment_status?: string[];
  q?: string;
};

export const ordersList = async ({
  limit,
  offset,
  id,
  payment_status,
  fulfillment_status,
  q,
}: TOrderList) => {
  return medusa.customers.listOrders({
    q,
    id,
    limit,
    offset,
    payment_status,
    fulfillment_status,
    expand: "items,returns,fulfillments",
  });
};
