import medusa from "@api/medusa";

export const adminUpdateOrder = async ({
  orderId,
  regionId,
}: {
  orderId: string;
  regionId: string;
}) => {
  const listShippingOption = await medusa.admin.shippingOptions.list({
    region_id: regionId,
  });
  const shippingMethod = await medusa.admin.orders.addShippingMethod(orderId, {
    price: listShippingOption.shipping_options?.[0]?.amount,
    option_id: listShippingOption.shipping_options?.[0]?.id,
  });
  return await medusa.admin.orders.update(orderId, {
    shipping_method: shippingMethod.orders,
  });
};
