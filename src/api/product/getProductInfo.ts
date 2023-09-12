import medusa from "@api/medusa";

export const getProductInfo = async ({ productId }: { productId: string }) => {
  return medusa.products.retrieve(productId);
};
