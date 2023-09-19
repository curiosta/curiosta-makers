import medusa from "@api/medusa";

export const adminGetuser = async ({ userId }: { userId: string }) => {
  return medusa.admin.users.retrieve(userId);
};
