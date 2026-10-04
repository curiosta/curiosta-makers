/** API base URL. Override per environment with VITE_PUBLIC_BASE_URL (see .env.example). */
export const baseUrl = (
  import.meta.env.VITE_PUBLIC_BASE_URL || "https://makers-api.curiosta.com"
).replace(/\/+$/, "");
