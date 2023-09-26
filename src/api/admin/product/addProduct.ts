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
  variants?: {
    title: string;
    manage_inventory: boolean;
    prices: {
      amount: number;
      currency_code: string;
    };
  }[];
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
    variants: [
      {
        title: "one size",
        manage_inventory: true,
        prices: [{ amount: 10000, currency_code: "usd" }],
      },
    ],
  });
};
