import medusa from "@api/medusa";

export const adminGetBatchJobs = async ({
  batchJobId,
}: {
  batchJobId: string;
}) => {
  return medusa.admin.batchJobs.retrieve(batchJobId);
};
