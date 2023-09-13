import medusa from "@api/medusa";
import type { AdminGetReturnsParams } from "@medusajs/medusa";

export const adminReturnsList = async ({
  limit,
  offset,
}: AdminGetReturnsParams) => {
  return medusa.admin.returns.list({
    limit,
    offset,
  });
};
