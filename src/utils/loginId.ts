/** Members without email sign in with a roll/admission number (same mapping as the backend). */
export const ROLL_EMAIL_DOMAIN = "roll.makers.invalid";

export function toLoginEmail(input: string) {
  const v = input.trim();
  if (v.includes("@")) return v.toLowerCase();
  const slug = v.toUpperCase().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug}@${ROLL_EMAIL_DOMAIN}`;
}

export function isRollEmail(email?: string | null) {
  return !!email && email.toLowerCase().endsWith(`@${ROLL_EMAIL_DOMAIN}`);
}

/** What to show instead of the synthetic email. */
export function displayLogin(customer: { email?: string; metadata?: any } | null | undefined) {
  if (!customer) return "";
  if (isRollEmail(customer.email)) return `Roll no. ${customer.metadata?.roll_number ?? ""}`.trim();
  return customer.email || "";
}
