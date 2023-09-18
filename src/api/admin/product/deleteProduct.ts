import medusa from "@api/medusa";

export const adminDeleteProduct = async (productId: string) => {
  return medusa.admin.products.delete(productId);
};
