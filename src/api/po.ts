import { apiFetch } from "@/api/http";

export type TSuggestion = {
  product_id: string;
  variant_id: string;
  title: string;
  spec: string | null;
  unit: string;
  stock: number;
  reorder_level: number;
  suggested_qty: number;
  source: "low_stock" | "shortfall" | "pending_demand";
  shortfall?: number;
  demand?: number;
  requests?: number;
  find_online_url: string;
};
export type TPoLine = {
  key: string;
  product_id?: string | null;
  variant_id?: string | null;
  title: string;
  spec?: string | null;
  unit: string;
  quantity: number | string;
  unit_price?: number | string | null;
  gst_percent?: number | string | null;
  source: string;
};
export type TParty = { name: string; address: string; gstin: string; email: string; phone: string };
export type TPurchaseOrder = {
  id: string;
  po_number: string;
  po_date: string;
  buyer: TParty;
  supplier: TParty | null;
  currency: string;
  notes: string | null;
  subtotal: number;
  tax_total: number;
  grand_total: number;
  created_at: string;
  lines: (TPoLine & { position: number; line_subtotal: number; line_tax: number; line_total: number; find_online_url: string })[];
};

export const poSuggestions = async () =>
  (await apiFetch<{ low_stock: TSuggestion[]; shortfalls: TSuggestion[]; pending_demand: TSuggestion[] }>("/admin/mms-po/suggestions")).data;
export const createPo = async (body: unknown) =>
  (await apiFetch<{ purchase_order: TPurchaseOrder }>("/admin/mms-po", { method: "POST", body })).data.purchase_order;
export const listPos = async () => (await apiFetch<{ purchase_orders: any[]; count: number }>("/admin/mms-po")).data;
export const getPo = async (id: string) => (await apiFetch<{ purchase_order: TPurchaseOrder }>(`/admin/mms-po/${id}`)).data.purchase_order;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
/** Same maths as the backend (which recomputes and is authoritative). */
export function lineTotals(l: Pick<TPoLine, "quantity" | "unit_price" | "gst_percent">) {
  const q = Number(l.quantity) || 0;
  const p = l.unit_price === "" || l.unit_price === null || l.unit_price === undefined ? null : Number(l.unit_price);
  const g = Number(l.gst_percent) || 0;
  const sub = p === null || !Number.isFinite(p) ? 0 : round2(q * p);
  const tax = round2((sub * g) / 100);
  return { sub, tax, total: round2(sub + tax), priced: p !== null };
}
export function poTotals(lines: TPoLine[]) {
  let sub = 0, tax = 0;
  for (const l of lines) {
    const t = lineTotals(l);
    sub += t.sub;
    tax += t.tax;
  }
  return { subtotal: round2(sub), tax_total: round2(tax), grand_total: round2(sub + tax) };
}
export const inr = (n: number | null | undefined) =>
  n === null || n === undefined ? "" : n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
