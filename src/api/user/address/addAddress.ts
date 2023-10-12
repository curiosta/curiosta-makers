import medusa from "@api/medusa";
import type { AddressCreatePayload } from "@medusajs/medusa";

export const addAddress = (address: AddressCreatePayload) => {
  return medusa.customers.addresses.addAddress({
    address,
  });
};
