/**
 * The ONE place for the user-facing product name. Change it here (plus the PWA manifest
 * in vite.config.ts and <title> in index.html, which import/mirror these values).
 * Internal identifiers (AWS stack "mms", buckets, SSM /mms/*, API paths /admin/mms-*) stay unchanged.
 */
export const APP_NAME = "MINT";
export const APP_FULL_NAME = "Makers Inventory & Tools";
export const APP_DISPLAY_NAME = `Curiosta ${APP_NAME}`;
export const APP_TAGLINE = `${APP_FULL_NAME}: issue, borrow and track makerspace inventory.`;

/** Public hostname. The old one 301-redirects at CloudFront (template LegacyDomain) and the app also moves itself. */
export const APP_DOMAIN = "mint.curiosta.com";
export const LEGACY_DOMAIN = "makers.curiosta.com";
export const APP_URL = `https://${APP_DOMAIN}`;

export const GRIEVANCE_EMAIL = "info@curiosta.com";
/** TODO(Manoj): confirm the registered legal entity that operates the service. */
export const LEGAL_ENTITY = "[Legal entity name: to be confirmed]";
