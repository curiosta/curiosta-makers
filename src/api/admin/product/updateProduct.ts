import medusa from "@api/medusa";

type TUpdateProduct = {
  productId: string;
  title: string;
  description?: string;
  status?: string;
  categories?: {
    id: string;
  }[];
  images?: string[];
  thumbnail?: string;
  variantId: string;
  inventory_quantity?: number;
};

export const adminUpdateProduct = async ({
  productId,
  title,
  description,
  status,
  categories,
  images,
  thumbnail,
  variantId,
  inventory_quantity,
}: TUpdateProduct) => {
  return medusa.admin.products.update(productId, {
    title,
    description,
    status,
    categories,
    images,
    thumbnail,
    variants: [
      {
        id: variantId,
        inventory_quantity,
      },
    ],
  });
};
