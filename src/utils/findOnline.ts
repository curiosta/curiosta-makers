/** "Find online": a plain Google search for the item name + key spec (replaces the old store link). */
export function findOnlineUrl(title?: string | null, spec?: string | null) {
  const q = [title, spec].filter(Boolean).join(" ").trim();
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

/** Key spec for a product: metadata.spec, else subtitle. */
export function productSpec(p: any): string | null {
  return (p?.metadata?.spec as string) || p?.subtitle || null;
}
