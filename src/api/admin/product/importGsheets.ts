import { apiFetch } from "@/api/http";

export type GsheetsImportResult =
  | { status: "queued"; rows: number }
  | { status?: string; [key: string]: unknown };

/** 200 = imported now; 202 = large sheet, import continues in the background. */
export const adminImportGsheets = async () => {
  const { status, data } = await apiFetch<GsheetsImportResult>("/admin/sheets");
  return { queued: status === 202, ...data };
};
