import { apiFetch } from "@/api/http";

export const adminGsheetsSyncCategory = async () => {
  const { data } = await apiFetch<{ status: string }>("/admin/sheets/sync-categories");
  if (data?.status && data.status !== "ok") throw new Error(data.status);
  return data;
};
