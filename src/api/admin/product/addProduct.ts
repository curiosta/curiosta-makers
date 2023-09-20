import medusa from "@api/medusa";

type TAddProduct = {
  title: string;
  description?: string;
  status?: string;
  categories?: {
    id: string;
  }[];
  images?: string[];
  thumbnail?: string;
};

export const adminAddProduct = async ({
  title,
  description,
  status,
  categories,
  images,
  thumbnail,
}: TAddProduct) => {
  return medusa.admin.products.create({
    title,
    description,
    status,
    categories,
    images,
    thumbnail,
  });
};
