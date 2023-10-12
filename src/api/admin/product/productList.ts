import medusa from "@api/medusa";

type TGetProductsParams = {
  q?: string;
  limit?: number;
  offset?: number;
  category_id?: string[];
  order?: string;
  status?: string[];
};

export const adminProductList = async ({
  q,
  limit,
  offset,
  category_id,
  order,
  status,
}: TGetProductsParams) => {
  return medusa.admin.products.list({
    q,
    limit,
    offset,
    category_id,
    order,
    status,
  });
};
