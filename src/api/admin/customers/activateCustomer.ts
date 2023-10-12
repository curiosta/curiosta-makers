const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminActivateCustomer = async ({ email }: { email: string }) => {
  const response = await fetch(`${baseUrl}/admin/customers/restore`, {
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
