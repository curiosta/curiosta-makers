import medusa from "@api/medusa";

export const adminUploadFile = async (file: File) => {
  return medusa.admin.uploads.create(file);
};
