import medusa from "@api/medusa";

export const adminListUser = async () => {
  return medusa.admin.users.list();
};
