import medusa from "@api/medusa";
import { RequestQueryFields } from "@medusajs/medusa";

export const adminListCategory = async ({
  limit,
  offset,
}: RequestQueryFields) => {
  return medusa.admin.productCategories.list({
    limit,
    offset,
    include_descendants_tree: true,
  });
};
