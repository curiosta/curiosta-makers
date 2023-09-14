import medusa from "@api/medusa";

export const adminDeleteCategory = async ({
  productCategoryId,
}: {
  productCategoryId: string;
}) => {
  return medusa.admin.productCategories.delete(productCategoryId);
};
