import medusa from "@/api/medusa";
type TOrderList = {
  limit?: number;
  offset?: number;
  id?: string;
  payment_status?: string[];
  fulfillment_status?: string[];
};

export const ordersList = async ({
  limit,
  offset,
  id,
  payment_status,
  fulfillment_status,
}: TOrderList) => {
  return medusa.customers.listOrders({
    id,
    limit,
    offset,
    payment_status,
    fulfillment_status,
    expand: "items,returns,fulfillments",
  });
};
