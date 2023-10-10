import medusa from "@api/medusa";
import { StoreGetRegionsParams } from "@medusajs/medusa";

export const listRegion = async ({ limit, offset }: StoreGetRegionsParams) => {
  return medusa.regions.list({ limit, offset });
};
