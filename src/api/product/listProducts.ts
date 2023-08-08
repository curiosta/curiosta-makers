import medusa from "@api/medusa";
import { StoreGetProductsParams } from "@medusajs/medusa";

export const listProducts = async ({
  limit,
  offset,
  category_id,
  order,
}: StoreGetProductsParams) => {
  return medusa.products.list({
    limit,
    offset,
    category_id,
    order,
  });
};
