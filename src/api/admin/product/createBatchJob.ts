import medusa from "@api/medusa";

type TCreateBatchJobs = {
  fileKey?: string;
  type: "product-export" | "product-import";
};

export const adminCreateBatchJobs = async ({
  fileKey,
  type,
}: TCreateBatchJobs) => {
  return medusa.admin.batchJobs.create({
    type,
    context: {
      fileKey,
    },
    dry_run: false,
  });
};
