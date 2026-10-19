import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { route } from "preact-router";
import TopNavbar from "@/components/Navbar/TopNavbar";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import Button from "@/components/Button";
import FindOnlineLink from "@/components/FindOnlineLink";
import { Alert, Card, Field, PageShell, TextArea } from "@/components/Field";
import { createPo, inr, lineTotals, poSuggestions, poTotals, TPoLine, TSuggestion } from "@/api/po";
import { getSettings, TSettings } from "@/api/privacy";
import { adminProductList } from "@/api/admin/product/productList";
import { productSpec } from "@/utils/findOnline";

let seq = 0;
const key = () => `l${++seq}`;
const fromSuggestion = (s: TSuggestion): TPoLine => ({
  key: key(), product_id: s.product_id, variant_id: s.variant_id, title: s.title, spec: s.spec, unit: s.unit || "pcs",
  quantity: s.suggested_qty, unit_price: "", gst_percent: 18, source: s.source,
});

const groupTitle: Record<string, string> = {
  low_stock: "At or below reorder level",
  shortfall: "Short-closed requests (last 90 days)",
  pending_demand: "Open requests above stock",
};

/** Admin: build a purchase order from low stock / shortfalls, edit, save, then download PDF/CSV. */
const PurchaseOrderCreate = () => {
  const settings = useSignal<TSettings | null>(null);
  const sugg = useSignal<Record<string, TSuggestion[]> | null>(null);
  const lines = useSignal<TPoLine[]>([]);
  const error = useSignal("");
  const busy = useSignal(false);
  const search = useSignal("");
  const results = useSignal<any[]>([]);

  useEffect(() => {
    getSettings().then((s) => (settings.value = s)).catch((e) => (error.value = e.message));
    poSuggestions()
      .then((s) => {
        sugg.value = { low_stock: s.low_stock, shortfall: s.shortfalls, pending_demand: s.pending_demand };
        // Preselect everything at/below reorder level.
        lines.value = s.low_stock.map(fromSuggestion);
      })
      .catch((e) => (error.value = e.message));
  }, []);

  useEffect(() => {
    const q = search.value.trim();
    if (q.length < 2) return void (results.value = []);
    const t = setTimeout(() => adminProductList({ q, limit: 8 }).then((r) => (results.value = r.products)).catch(() => null), 350);
    return () => clearTimeout(t);
  }, [search.value]);

  const has = (variantId?: string | null) => !!variantId && lines.value.some((l) => l.variant_id === variantId);
  const toggle = (s: TSuggestion) => {
    lines.value = has(s.variant_id) ? lines.value.filter((l) => l.variant_id !== s.variant_id) : [...lines.value, fromSuggestion(s)];
  };
  const update = (k: string, patch: Partial<TPoLine>) => (lines.value = lines.value.map((l) => (l.key === k ? { ...l, ...patch } : l)));
  const remove = (k: string) => (lines.value = lines.value.filter((l) => l.key !== k));
  const addBlank = () => (lines.value = [...lines.value, { key: key(), title: "", unit: "pcs", quantity: 1, unit_price: "", gst_percent: 18, source: "manual" }]);
  const addProduct = (p: any) => {
    const v = p.variants?.[0];
    if (has(v?.id)) return;
    lines.value = [...lines.value, { key: key(), product_id: p.id, variant_id: v?.id, title: p.title, spec: productSpec(p), unit: p.metadata?.unit || "pcs", quantity: 1, unit_price: "", gst_percent: 18, source: "manual" }];
    search.value = "";
  };

  const totals = poTotals(lines.value);

  const submit = async (e: Event) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget as HTMLFormElement);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    error.value = "";
    if (!lines.value.length) return void (error.value = "Add at least one item.");
    busy.value = true;
    try {
      const po = await createPo({
        po_date: g("po_date"),
        supplier: { name: g("sup_name"), address: g("sup_address"), gstin: g("sup_gstin"), email: g("sup_email"), phone: g("sup_phone") },
        notes: g("notes"),
        lines: lines.value.map(({ key: _k, ...l }) => l),
      });
      route(`/purchase-orders/${po.id}?created=1`);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      busy.value = false;
    }
  };

  const org = settings.value?.org;
  return (
    <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
      <TopNavbar />
      <PageShell title="Create purchase order" wide>
        {error.value ? <Alert>{error.value}</Alert> : null}
        <Card title="Suggested items">
          {!sugg.value ? <p role="status">Loading…</p> : (
            Object.entries(sugg.value).map(([g, items]) => (
              <fieldset key={g} className="flex flex-col gap-2">
                <legend className="font-mono text-xs uppercase tracking-[0.14em] text-sea-500 mb-1">{groupTitle[g]} ({items.length})</legend>
                {items.length === 0 ? <p className="text-sm text-muted">Nothing here.</p> : items.map((s) => (
                  <div key={`${g}-${s.variant_id}`} className="flex flex-wrap items-center gap-3 border-b border-line pb-2">
                    <input type="checkbox" id={`s-${g}-${s.variant_id}`} checked={has(s.variant_id)} onChange={() => toggle(s)} className="rounded text-sea-700" />
                    <label htmlFor={`s-${g}-${s.variant_id}`} className="flex-1 min-w-[12rem] text-sm">
                      <span className="font-semibold text-ink">{s.title}</span>
                      {s.spec ? <span className="text-muted"> · {s.spec}</span> : null}
                      <span className="block text-ink-2">
                        Stock {s.stock} · reorder at {s.reorder_level}
                        {s.shortfall ? ` · short by ${s.shortfall}` : ""}{s.demand ? ` · requested ${s.demand}` : ""} · suggest {s.suggested_qty}
                      </span>
                    </label>
                    <FindOnlineLink title={s.title} spec={s.spec} />
                  </div>
                ))}
              </fieldset>
            ))
          )}
        </Card>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Card title="Items on this order">
            {lines.value.length === 0 ? <p className="text-sm text-muted">No items yet. Tick suggestions above or add items below.</p> : null}
            {lines.value.map((l, i) => {
              const t = lineTotals(l);
              return (
                <div key={l.key} className="rounded-md border border-line p-3 flex flex-col gap-2" role="group" aria-label={`Line ${i + 1}`}>
                  <div className="grid gap-2 sm:grid-cols-[2fr,1.5fr]">
                    <Field id={`title-${l.key}`} label="Item" required value={l.title} onInput={(e: any) => update(l.key, { title: e.currentTarget.value })} maxLength={200} />
                    <Field id={`spec-${l.key}`} label="Key spec" value={l.spec || ""} onInput={(e: any) => update(l.key, { spec: e.currentTarget.value })} maxLength={200} />
                  </div>
                  <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                    <Field id={`qty-${l.key}`} label="Qty" type="number" min="0.001" step="any" required value={l.quantity} onInput={(e: any) => update(l.key, { quantity: e.currentTarget.value })} />
                    <Field id={`unit-${l.key}`} label="Unit" value={l.unit} onInput={(e: any) => update(l.key, { unit: e.currentTarget.value })} maxLength={20} />
                    <Field id={`price-${l.key}`} label="Unit price (INR, optional)" type="number" min="0" step="0.01" value={l.unit_price ?? ""} onInput={(e: any) => update(l.key, { unit_price: e.currentTarget.value })} />
                    <Field id={`gst-${l.key}`} label="GST %" type="number" min="0" max="100" step="0.01" value={l.gst_percent ?? ""} onInput={(e: any) => update(l.key, { gst_percent: e.currentTarget.value })} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-ink-2">{t.priced ? `Line total INR ${inr(t.total)}` : "Price to be confirmed"}</span>
                    <span className="flex gap-2">
                      {l.title ? <FindOnlineLink title={l.title} spec={l.spec} /> : null}
                      <Button type="button" variant="secondary" onClick={() => remove(l.key)} aria-label={`Remove line ${i + 1}`}>Remove</Button>
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col gap-2">
              <Field id="po-search" label="Add from catalogue" type="search" placeholder="Search items…" value={search.value} onInput={(e: any) => (search.value = e.currentTarget.value)} autocomplete="off" />
              {results.value.length ? (
                <ul className="flex flex-col divide-y divide-line border border-line rounded-md bg-card" aria-label="Search results">
                  {results.value.map((p) => (
                    <li key={p.id}><button type="button" className="w-full text-left p-2 text-sm hover:bg-teal-soft" onClick={() => addProduct(p)}>{p.title} <span className="text-muted">· stock {p.variants?.[0]?.inventory_quantity ?? 0}</span></button></li>
                  ))}
                </ul>
              ) : null}
              <div><Button type="button" variant="secondary" onClick={addBlank}>Add item not in catalogue</Button></div>
            </div>
            <dl className="ml-auto grid grid-cols-[auto,auto] gap-x-6 text-sm text-right">
              <dt>Subtotal</dt><dd>INR {inr(totals.subtotal)}</dd>
              <dt>GST</dt><dd>INR {inr(totals.tax_total)}</dd>
              <dt className="font-semibold">Grand total</dt><dd className="font-semibold">INR {inr(totals.grand_total)}</dd>
            </dl>
          </Card>

          <Card title="Order details">
            <div className="text-sm text-ink-2">
              <p className="font-semibold text-ink">Buyer: {org?.name || <span className="text-bad">not set</span>}</p>
              {org?.address ? <p className="whitespace-pre-line">{org.address}</p> : null}
              {org?.gstin ? <p>GSTIN {org.gstin}</p> : null}
              <a className="underline text-sea-900" href="/settings">Edit organisation details</a>
            </div>
            <Field id="po_date" label="PO date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="max-w-xs" />
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-ink mb-1">Supplier (optional)</legend>
              <Field id="sup_name" label="Supplier name" maxLength={120} />
              <TextArea id="sup_address" label="Supplier address" maxLength={400} />
              <div className="grid sm:grid-cols-3 gap-2">
                <Field id="sup_gstin" label="Supplier GSTIN" maxLength={15} />
                <Field id="sup_email" label="Supplier email" type="email" />
                <Field id="sup_phone" label="Supplier phone" type="tel" />
              </div>
            </fieldset>
            <TextArea id="notes" label="Notes (delivery, payment terms…)" maxLength={2000} />
          </Card>
          <div className="flex gap-3 flex-wrap">
            <Button type="submit" disabled={busy.value}>Save purchase order</Button>
            <Button link="/purchase-orders" variant="secondary">Cancel</Button>
          </div>
        </form>
      </PageShell>
      <BottomNavbar />
    </div>
  );
};

export default PurchaseOrderCreate;
