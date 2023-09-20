import medusa from "@api/medusa";

export const adminDeleteuser = async ({ userId }: { userId: string }) => {
  return medusa.admin.users.delete(userId);
};
