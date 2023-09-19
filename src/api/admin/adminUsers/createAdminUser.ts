import medusa from "@api/medusa";
import { AdminCreateUserRequest } from "@medusajs/medusa";

export const adminCreateUser = async ({
  email,
  first_name,
  last_name,
  password,
}: AdminCreateUserRequest) => {
  return medusa.admin.users.create({
    email,
    first_name,
    last_name,
    password,
  });
};
