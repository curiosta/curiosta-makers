import medusa from "@api/medusa";

type TAddCategory = {
  categoryName: string;
  categoryDescription?: string;
  isActive: boolean;
  parentCategoryId?: string;
  handle?: string;
};
export const adminAddCategory = async ({
  categoryName,
  categoryDescription,
  isActive,
  handle,
  parentCategoryId,
}: TAddCategory) => {
  return medusa.admin.productCategories.create({
    name: categoryName,
    description: categoryDescription,
    is_active: isActive,
    parent_category_id: parentCategoryId,
    handle,
  });
};
