import medusa from "@api/medusa";

export const adminUpdateOrder = async (orderId: string) => {
  const shippingMethod = await medusa.admin.orders.addShippingMethod(orderId, {
    price: 1000,
    option_id: "so_01H1RD65NSRKRFWBVJXP7PG0NX",
  });
  return await medusa.admin.orders.update(orderId, {
    shipping_method: shippingMethod.orders,
  });
};
