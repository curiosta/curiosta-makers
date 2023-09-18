import medusa from "@api/medusa";

export const adminGetProduct = async ({ productId }: { productId: string }) => {
  return medusa.admin.products.retrieve(productId);
};
