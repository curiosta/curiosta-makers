import medusa from "@api/medusa";

export const adminGetCategory = async ({
  productCategoryId,
}: {
  productCategoryId: string;
}) => {
  return medusa.admin.productCategories.retrieve(productCategoryId);
};
