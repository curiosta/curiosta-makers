import { apiFetch } from "@/api/http";

export type FileMode = "off" | "optional" | "required";
export type TSettings = {
  org: { name: string; address: string; gstin: string; email: string; phone: string };
  id_proof_mode: FileMode;
  photo_mode: FileMode;
  id_doc_retention_days: number;
  inactive_file_retention_days: number;
  po_prefix: string;
};
export type TPrivacyStatus = {
  known: boolean;
  is_minor: boolean | null;
  consent_status: "pending" | "given" | "withdrawn";
  needs_acknowledgement: boolean;
  blocked: boolean;
  notice_version: string;
  acknowledged_at?: string;
};

export const getSettings = async () => (await apiFetch<{ settings: TSettings }>("/admin/mms-settings")).data.settings;
export const saveSettings = async (s: Partial<TSettings>) =>
  (await apiFetch<{ settings: TSettings }>("/admin/mms-settings", { method: "POST", body: s })).data.settings;

export const createMember = async (body: unknown) =>
  (await apiFetch<{ customer: { id: string; email: string }; login_id: string; consent_status: string; guardian_link_path: string | null }>(
    "/admin/mms-members", { method: "POST", body })).data;

export const memberPrivacy = async (id: string) => (await apiFetch<any>(`/admin/mms-members/${id}/privacy`)).data;
export const guardianLink = async (id: string) =>
  (await apiFetch<{ guardian_link_path: string; expires_in_days: number }>(`/admin/mms-members/${id}/guardian-link`, { method: "POST", body: {} })).data;
export const attestGuardian = async (id: string, body: unknown) =>
  (await apiFetch(`/admin/mms-members/${id}/guardian-consent`, { method: "POST", body })).data;
export const adminExport = async (id: string) => (await apiFetch<any>(`/admin/mms-members/${id}/export`)).data;
export const anonymise = async (id: string) =>
  (await apiFetch<any>(`/admin/mms-members/${id}/anonymise`, { method: "POST", body: { confirm: "ANONYMISE" } })).data;
export const listPrivacyRequests = async (status = "open") =>
  (await apiFetch<{ requests: any[] }>(`/admin/mms-privacy/requests?status=${status}`)).data.requests;
export const resolvePrivacyRequest = async (id: string, status: "completed" | "rejected", note?: string) =>
  (await apiFetch(`/admin/mms-privacy/requests/${id}`, { method: "POST", body: { status, note } })).data;

export const myPrivacy = async () => (await apiFetch<TPrivacyStatus>("/store/mms-privacy/me")).data;
export const acknowledge = async (body: { notice_version: string; accept: boolean; is_minor?: boolean }) =>
  (await apiFetch<TPrivacyStatus>("/store/mms-privacy/acknowledge", { method: "POST", body })).data;
export const myExport = async () => (await apiFetch<any>("/store/mms-privacy/export")).data;
export const myRequest = async (type: "deletion" | "correction", details?: string) =>
  (await apiFetch<{ id: string; duplicate?: boolean }>("/store/mms-privacy/requests", { method: "POST", body: { type, details } })).data;

export const guardianInfo = async (token: string) =>
  (await apiFetch<{ member_first_name: string; guardian_name: string; notice_version: string; expires_at: string }>(
    "/store/mms-guardian/info", { method: "POST", body: { token } })).data;
export const guardianConfirm = async (body: unknown) =>
  (await apiFetch("/store/mms-guardian/confirm", { method: "POST", body })).data;

/** Save JSON as a file, client-side. */
export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
