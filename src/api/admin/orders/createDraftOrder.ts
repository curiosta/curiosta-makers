import medusa from "@api/medusa";
import {
  AddressPayload,
  AdminPostDraftOrdersReq,
  ShippingOption,
} from "@medusajs/medusa";

type TAdminCreateDraftOrder = {
  email: string;
  region_id: string;
  items: {
    quantity: number;
    variant_id: string;
    metadata: { cartType: string };
  }[];
  address: AddressPayload | string;
  customer_id: string;
};
export const adminCreateDraftOrder = async ({
  email,
  region_id,
  items,
  address,
  customer_id,
}: TAdminCreateDraftOrder) => {
  const listShippingOption = await medusa.admin.shippingOptions.list({
    region_id,
  });
  return await medusa.admin.draftOrders.create({
    email,
    region_id,
    customer_id,
    items,
    billing_address: address,
    shipping_address: address,
    shipping_methods: [
      {
        option_id: listShippingOption.shipping_options[0]?.id,
      },
    ],
  });
};
