import medusa from "@api/medusa";
import { AdminPostCustomersReq } from "@medusajs/medusa";

export const adminCreateCustomer = async ({
  email,
  first_name,
  last_name,
  password,
}: AdminPostCustomersReq) => {
  return medusa.admin.customers.create({
    email,
    first_name,
    last_name,
    password,
  });
};
