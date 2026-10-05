/**
 * API base URL. Production serves the PWA and the API from the same CloudFront
 * origin (https://makers.curiosta.com, API under /store/* and /admin/*), so the
 * default is the page's own origin. Override with VITE_PUBLIC_BASE_URL for local
 * development (see .env.example).
 */
export const baseUrl = (
  import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin
).replace(/\/+$/, "");
