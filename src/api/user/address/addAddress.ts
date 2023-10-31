import medusa from "@api/medusa";
import type { AddressCreatePayload } from "@medusajs/medusa";

export const addAddress = (
  address: Omit<AddressCreatePayload, "metadata" | "company" | "address_2">
) => {
  return medusa.customers.addresses.addAddress({
    address,
  });
};
