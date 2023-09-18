import medusa from "@api/medusa";

export const adminDeleteUpload = async (file_key: string) => {
  return medusa.admin.uploads.delete({
    file_key,
  });
};
