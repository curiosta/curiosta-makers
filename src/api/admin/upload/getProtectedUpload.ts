import medusa from "@api/medusa";

export const adminGetProtectedUploadFile = async ({
  file_key,
}: {
  file_key: string;
}) => {
  return medusa.admin.uploads.getPresignedDownloadUrl({
    file_key,
  });
};
