import { apiFetch } from "@/api/http";

export const adminGsheetsSyncLocation = async () => {
  const { data } = await apiFetch<{ status: string }>("/admin/sheets/sync-locations");
  if (data?.status && data.status !== "ok") throw new Error(data.status);
  return data;
};
