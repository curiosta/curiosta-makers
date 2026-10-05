import { apiFetch } from "@/api/http";

/** URL of the linked Google Sheet (kept server-side; no longer baked into the build). */
export const adminGetGsheetsLink = async () => {
  const { data } = await apiFetch<{ url: string | null }>("/admin/sheets/link");
  return data?.url ?? null;
};
