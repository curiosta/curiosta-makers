import medusa from "@api/medusa";
import { AdminPostCustomersCustomerReq } from "@medusajs/medusa";

type TUpdateCustomer = AdminPostCustomersCustomerReq & {
  customerId: string;
};

export const adminUpdateCustomer = async ({
  customerId,
  email,
  first_name,
  last_name,
  password,
}: TUpdateCustomer) => {
  return medusa.admin.customers.update(customerId, {
    email,
    first_name,
    last_name,
    password,
  });
};
