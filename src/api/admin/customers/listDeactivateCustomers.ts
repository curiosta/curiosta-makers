import { Customer } from "@medusajs/medusa";

const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminListDeactivateCustomers = async () => {
  const response = await fetch(`${baseUrl}/admin/customers/list-deleted`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  return data as Customer[];
};
