import medusa from "@api/medusa";

type TAddCategory = {
  categoryName: string;
  categoryDescription: string;
  isActive: boolean;
  isInternal: boolean;
  handle: string;
};
export const adminAddCategory = async ({
  categoryName,
  categoryDescription,
  handle,
  isActive,
  isInternal,
}: TAddCategory) => {
  return medusa.admin.productCategories.create({
    name: categoryName,
    description: categoryDescription,
    is_active: isActive,
    is_internal: isInternal,
    handle,
  });
};
