import medusa from "@api/medusa";
import { AdminGetProductCategoriesParams } from "@medusajs/medusa";

export const adminListCategory = async ({
  limit,
  offset,
  q,
  parent_category_id,
}: AdminGetProductCategoriesParams) => {
  return medusa.admin.productCategories.list({
    q,
    limit,
    offset,
    include_descendants_tree: true,
    parent_category_id,
  });
};
