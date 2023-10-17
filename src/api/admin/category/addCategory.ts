import medusa from "@api/medusa";

type TAddCategory = {
  categoryName: string;
  categoryDescription?: string;
  isActive: boolean;
  isInternal: boolean;
  parentCategoryId?: string;
  handle?: string;
};
export const adminAddCategory = async ({
  categoryName,
  categoryDescription,
  isActive,
  isInternal,
  handle,
  parentCategoryId,
}: TAddCategory) => {
  return medusa.admin.productCategories.create({
    name: categoryName,
    description: categoryDescription,
    is_active: isActive,
    is_internal: isInternal,
    parent_category_id: parentCategoryId,
    handle,
  });
};
