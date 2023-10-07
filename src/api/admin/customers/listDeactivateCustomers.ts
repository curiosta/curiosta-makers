import { Customer } from "@medusajs/medusa";
import ky from "ky";

const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminListDeactivateCustomers = async () => {
  const data = await ky
    .get(`${baseUrl}admin/customers/list-deleted`, {
      credentials: "include",
    })
    .json();

  return data as Customer[];
};
