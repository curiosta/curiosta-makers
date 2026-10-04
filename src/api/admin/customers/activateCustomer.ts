import { apiFetch } from "@/api/http";

export const adminActivateCustomer = async ({ email }: { email: string }) => {
  const { data } = await apiFetch("/admin/customers/restore", { method: "POST", body: { email } });
  return data;
};
