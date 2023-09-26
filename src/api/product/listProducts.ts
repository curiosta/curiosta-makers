import medusa from "@api/medusa";
import { StoreGetProductsParams } from "@medusajs/medusa";

export const listProducts = async ({
  q,
  limit,
  offset,
  category_id,
  order,
}: StoreGetProductsParams) => {
  return medusa.products.list({
    q,
    limit,
    offset,
    category_id,
    order,
  });
};
