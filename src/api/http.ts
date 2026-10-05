import { baseUrl } from "./config";

export class ApiError extends Error {
  constructor(message: string, public status: number, public body?: unknown) {
    super(message);
  }
}

/**
 * fetch() for the custom MMS endpoints (not covered by medusa-js).
 * Sends the session cookie and throws ApiError on non-2xx so the UI can show the reason.
 */
export async function apiFetch<T = any>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<{ status: number; data: T }> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: init.method ?? "GET",
    credentials: "include",
    headers: init.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  let data: any = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* plain-text body */
  }
  if (!res.ok) {
    const reason =
      (data && typeof data === "object" && (data.error || data.message)) ||
      (res.status === 401 ? "Your session has expired, please log in again." : `Request failed (${res.status})`);
    throw new ApiError(String(reason), res.status, data);
  }
  return { status: res.status, data: data as T };
}
