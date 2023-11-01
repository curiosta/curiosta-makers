const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminGsheetsSyncLocation = async () => {
  const res = await fetch(`${baseUrl}/admin/sheets/sync-locations`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};
