import medusa from "@api/medusa";
import { AdminGetProductsParams } from "@medusajs/medusa";

export const adminProductList = async ({
  limit,
  offset,
  category_id,
  order,
}: AdminGetProductsParams) => {
  return medusa.admin.products.list({
    limit,
    offset,
    category_id,
    order,
  });
};
