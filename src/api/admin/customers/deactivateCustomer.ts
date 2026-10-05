import { apiFetch } from "@/api/http";

export const adminDeactivateCustomer = async ({ email }: { email: string }) => {
  const { data } = await apiFetch("/admin/customers/delete", { method: "POST", body: { email } });
  return data;
};
