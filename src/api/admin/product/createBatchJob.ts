import medusa from "@api/medusa";

export const adminCreateBatchJobs = async ({
  fileKey,
}: {
  fileKey: string;
}) => {
  return medusa.admin.batchJobs.create({
    type: "product-import",
    context: {
      fileKey,
    },
    dry_run: false,
  });
};
