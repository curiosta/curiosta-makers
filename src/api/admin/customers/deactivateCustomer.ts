import ky from "ky";

const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminDeactivateCustomer = async ({ email }: { email: string }) => {
  const data = await ky
    .post(`${baseUrl}admin/customers/delete`, {
      json: { email },
      credentials: "include",
    })
    .json();

  return data;
};
