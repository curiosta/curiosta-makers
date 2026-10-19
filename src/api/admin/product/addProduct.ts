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
  inventory_quantity: number;
  metadata?: Record<string, unknown>;
};

export const adminAddProduct = async ({
  title,
  description,
  status,
  categories,
  images,
  thumbnail,
  inventory_quantity,
  metadata,
}: TAddProduct) => {
  return medusa.admin.products.create({
    title,
    description,
    status,
    categories,
    images,
    thumbnail,
    metadata,
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
