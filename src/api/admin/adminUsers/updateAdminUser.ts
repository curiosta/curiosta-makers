import medusa from "@api/medusa";
import { AdminUpdateUserRequest } from "@medusajs/medusa";

type TUpdateCustomer = AdminUpdateUserRequest & {
  customerId: string;
};

export const adminUpdateUser = async ({
  customerId,
  first_name,
  last_name,
}: TUpdateCustomer) => {
  return medusa.admin.users.update(customerId, {
    first_name,
    last_name,
  });
};
