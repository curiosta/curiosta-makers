import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import TopNavbar from "@/components/Navbar/TopNavbar";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import Button from "@/components/Button";
import FindOnlineLink from "@/components/FindOnlineLink";
import { Alert, Card, PageShell } from "@/components/Field";
import { getPo, inr, listPos, TPurchaseOrder } from "@/api/po";
import { downloadPoCsv, downloadPoPdf } from "@/utils/poExport";

/** Admin: purchase order history. */
export const PurchaseOrders = () => {
  const rows = useSignal<any[] | null>(null);
  const error = useSignal("");
  useEffect(() => {
    listPos().then((r) => (rows.value = r.purchase_orders)).catch((e) => (error.value = e.message));
  }, []);
  return (
    <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
      <TopNavbar />
      <PageShell title="Purchase orders">
        <div><Button link="/purchase-orders/new">Create purchase order</Button></div>
        {error.value ? <Alert>{error.value}</Alert> : null}
        {rows.value === null ? <p role="status">Loading…</p> : rows.value.length === 0 ? <Alert kind="info">No purchase orders yet.</Alert> : (
          <ul className="flex flex-col gap-2">
            {rows.value.map((p) => (
              <li key={p.id}>
                <a href={`/purchase-orders/${p.id}`} className="flex flex-wrap justify-between gap-2 rounded-brand border border-line bg-card p-4 hover:bg-teal-soft">
                  <span className="font-semibold text-ink">{p.po_number}</span>
                  <span className="text-sm text-ink-2">{new Date(p.po_date).toLocaleDateString("en-IN")} · {p.supplier_name || "No supplier"} · {p.line_count} items · INR {inr(p.grand_total)}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </PageShell>
      <BottomNavbar />
    </div>
  );
};

/** Admin: one saved PO with PDF/CSV download. */
export const PurchaseOrderView = ({ id }: { id?: string }) => {
  const po = useSignal<TPurchaseOrder | null>(null);
  const error = useSignal("");
  const created = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("created");
  useEffect(() => {
    if (id) getPo(id).then((p) => (po.value = p)).catch((e) => (error.value = e.message));
  }, [id]);
  const p = po.value;
  return (
    <div className="flex flex-col items-center p-4 w-full bg-sand min-h-screen">
      <TopNavbar />
      <PageShell title={p ? `Purchase order ${p.po_number}` : "Purchase order"} wide>
        {created ? <Alert kind="ok">Purchase order saved.</Alert> : null}
        {error.value ? <Alert>{error.value}</Alert> : null}
        {!p ? <p role="status">Loading…</p> : (
          <>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => downloadPoPdf(p)}>Download PDF</Button>
              <Button type="button" variant="secondary" onClick={() => downloadPoCsv(p)}>Download CSV</Button>
              <Button link="/purchase-orders" variant="secondary">All purchase orders</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card title="Buyer">
                <p className="text-sm whitespace-pre-line">{[p.buyer.name, p.buyer.address, p.buyer.gstin && `GSTIN ${p.buyer.gstin}`].filter(Boolean).join("\n")}</p>
              </Card>
              <Card title="Supplier">
                <p className="text-sm whitespace-pre-line">{p.supplier ? [p.supplier.name, p.supplier.address, p.supplier.gstin && `GSTIN ${p.supplier.gstin}`].filter(Boolean).join("\n") : "Not specified"}</p>
              </Card>
            </div>
            <Card title={`Items · ${new Date(p.po_date).toLocaleDateString("en-IN")}`}>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">Purchase order lines</caption>
                  <thead className="bg-sea-700 text-white">
                    <tr>{["#", "Item", "Unit", "Qty", "Unit price", "GST %", "Total (INR)", ""].map((h, i) => <th scope="col" key={i} className="p-2 text-left">{h || <span className="sr-only">Find online</span>}</th>)}</tr>
                  </thead>
                  <tbody>
                    {p.lines.map((l) => (
                      <tr key={l.position} className="border-t border-line">
                        <td className="p-2">{l.position}</td>
                        <td className="p-2">{l.title}{l.spec ? <span className="block text-muted">{l.spec}</span> : null}</td>
                        <td className="p-2">{l.unit}</td>
                        <td className="p-2">{l.quantity}</td>
                        <td className="p-2">{l.unit_price === null ? "TBC" : inr(Number(l.unit_price))}</td>
                        <td className="p-2">{l.gst_percent}</td>
                        <td className="p-2">{l.unit_price === null ? "TBC" : inr(l.line_total)}</td>
                        <td className="p-2"><FindOnlineLink title={l.title} spec={l.spec} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <dl className="ml-auto grid grid-cols-[auto,auto] gap-x-6 text-sm text-right">
                <dt>Subtotal</dt><dd>INR {inr(p.subtotal)}</dd>
                <dt>GST</dt><dd>INR {inr(p.tax_total)}</dd>
                <dt className="font-semibold">Grand total</dt><dd className="font-semibold">INR {inr(p.grand_total)}</dd>
              </dl>
              {p.notes ? <p className="text-sm whitespace-pre-wrap"><strong>Notes:</strong> {p.notes}</p> : null}
            </Card>
          </>
        )}
      </PageShell>
      <BottomNavbar />
    </div>
  );
};
