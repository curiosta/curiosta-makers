import medusa from "@api/medusa";
import { AdminGetProductCategoriesParams } from "@medusajs/medusa";

export const adminListCategory = async ({
  q,
  is_active,
  is_internal,
  limit,
  offset,
  parent_category_id,
}: AdminGetProductCategoriesParams) => {
  return medusa.admin.productCategories.list({
    q,
    is_active,
    is_internal,
    limit,
    offset,
    include_descendants_tree: true,
    parent_category_id,
  });
};
