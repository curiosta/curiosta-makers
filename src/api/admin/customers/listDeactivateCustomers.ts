import type { Customer } from "@medusajs/medusa";
import { apiFetch } from "@/api/http";

export const adminListDeactivateCustomers = async () => {
  const { data } = await apiFetch<Customer[]>("/admin/customers/list-deleted");
  return data;
};
