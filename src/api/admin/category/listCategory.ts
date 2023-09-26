import medusa from "@api/medusa";
import {
  RequestQueryFields,
  AdminGetProductCategoriesParams,
} from "@medusajs/medusa";

export const adminListCategory = async ({
  q,
  is_active,
  is_internal,
  limit,
  offset,
}: AdminGetProductCategoriesParams) => {
  return medusa.admin.productCategories.list({
    q,
    is_active,
    is_internal,
    limit,
    offset,
    include_descendants_tree: true,
  });
};
