import medusa from "@api/medusa";

export const adminProtectedUploadFile = async (file: File) => {
  return medusa.admin.uploads.createProtected(file);
};
