import medusa from "@api/medusa";

type TListBatchJobs = {
  type: ["product-export" | "product-import"];
};
export const adminListBatchJobs = async ({ type }: TListBatchJobs) => {
  return medusa.admin.batchJobs.list({ type, order: "-created_at" });
};
