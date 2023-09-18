import medusa from "@api/medusa";

type TAddProduct = {
  productId: string;
  title: string;
  description?: string;
  status?: string;
  categories?: {
    id: string;
  }[];
  images?: string[];
  thumbnail?: string;
};

export const adminUpdateProduct = async ({
  productId,
  title,
  description,
  status,
  categories,
  images,
  thumbnail,
}: TAddProduct) => {
  return medusa.admin.products.update(productId, {
    title,
    description,
    status,
    categories,
    images,
    thumbnail,
  });
};
