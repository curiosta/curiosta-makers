const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

export const adminExportGsheets = async () => {
  const res = await fetch(`${baseUrl}/admin/sheets/sync-products`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};
