import medusa from "@api/medusa";
import { RequestQueryFields } from "@medusajs/medusa";

export const categoriesList = async ({ limit, offset }: RequestQueryFields) => {
  return medusa.productCategories.list({
    limit,
    offset,
    expand: "products",
    include_descendants_tree: true,
  });
};
