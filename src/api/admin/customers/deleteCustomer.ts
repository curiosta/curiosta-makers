const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminDeleteCustomer = async ({ email }: { email: string }) => {
  const response = await fetch(`${baseUrl}admin/customers/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data;
};
