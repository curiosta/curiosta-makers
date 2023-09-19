import medusa from "@api/medusa";

type TUpdateCategory = {
  productCategoryId: string;
  categoryName: string;
  categoryDescription: string;
  isActive: boolean;
  isInternal: boolean;
};
export const adminUpdateCategory = async ({
  productCategoryId,
  categoryName,
  categoryDescription,
  isActive,
  isInternal,
}: TUpdateCategory) => {
  return medusa.admin.productCategories.update(productCategoryId, {
    name: categoryName,
    description: categoryDescription,
    is_active: isActive,
    is_internal: isInternal,
  });
};
