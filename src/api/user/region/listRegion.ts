import medusa from "@api/medusa";

export const listRegion = async () => {
  return medusa.regions.list();
};
