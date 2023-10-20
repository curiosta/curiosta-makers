import medusa from "@api/medusa";
import { AdminPostCustomersCustomerReq } from "@medusajs/medusa";

type TCustomerMetadata = {
  cart_id?: string | null;
  profile_image_key?: string;
  dob?: Date;
  gender?: string;
  documentInfo: {
    idType: string;
    idNumber: string;
    idImageKey: string;
  }[];
};

type TUpdateCustomer = Omit<AdminPostCustomersCustomerReq, "metadata"> & {
  customerId: string;
  metadata?: TCustomerMetadata;
};

export const adminUpdateCustomer = async ({
  customerId,
  email,
  first_name,
  last_name,
  phone,
  metadata,
}: TUpdateCustomer) => {
  return medusa.admin.customers.update(customerId, {
    email,
    first_name,
    last_name,
    phone,
    metadata,
  });
};
