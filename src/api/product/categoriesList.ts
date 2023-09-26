import medusa from "@api/medusa";
import { StoreGetProductCategoriesParams } from "@medusajs/medusa";

export const categoriesList = async ({
  q,
  limit,
  offset,
}: StoreGetProductCategoriesParams) => {
  return medusa.productCategories.list({
    q,
    limit,
    offset,
    expand: "products",
    include_descendants_tree: true,
  });
};
