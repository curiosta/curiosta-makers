const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminGsheetsSyncCategory = async () => {
  const res = await fetch(`${baseUrl}/admin/sheets/sync-categories`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};
