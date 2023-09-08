import medusa from "@api/medusa";

export const adminConfirmBatchJobs = async ({
  batchJobId,
}: {
  batchJobId: string;
}) => {
  return medusa.admin.batchJobs.confirm(batchJobId);
};
