import medusa from "@api/medusa";

export const adminListRegion = async () => {
  return medusa.admin.regions.list();
};
