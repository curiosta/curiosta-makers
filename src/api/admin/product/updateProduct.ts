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
  inventory_quantity,
}: TAddProduct) => {
  return medusa.admin.products.update(productId, {
    title,
    description,
    status,
    categories,
    images,
    thumbnail,
    variants: [
      {
        title: "one size",
        inventory_quantity,
        manage_inventory: true,
        prices: [{ amount: 10000, currency_code: "usd" }],
      },
    ],
  });
};
