import medusa from "@api/medusa";

export const adminDeleteUploadFile = async (file_key: string) => {
  return medusa.admin.uploads.delete({
    file_key,
  });
};
