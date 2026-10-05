import { apiFetch } from "@/api/http";

export const adminExportGsheets = async () => {
  const { data } = await apiFetch<{ status: string }>("/admin/sheets/sync-products");
  if (data?.status && data.status !== "ok") throw new Error(data.status);
  return data;
};
