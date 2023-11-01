import medusa from "@api/medusa";
import { AdminPostCustomersReq } from "@medusajs/medusa";

type TCustomerMetadata = {
  cart_id?: string | null;
  profile_image_key?: string;
  dob: Date;
  gender: string;
  documentInfo?: {
    idType: string;
    idNumber: string;
    idImageKey: string;
  }[];
  temp_password: string;
  new_account: boolean;
};

type TAddCustomer = Omit<AdminPostCustomersReq, "metadata"> & {
  metadata?: TCustomerMetadata;
};

export const adminCreateCustomer = async ({
  email,
  first_name,
  last_name,
  password,
  phone,
  metadata,
}: TAddCustomer) => {
  return medusa.admin.customers.create({
    email,
    first_name,
    last_name,
    password,
    phone,
    metadata,
  });
};
