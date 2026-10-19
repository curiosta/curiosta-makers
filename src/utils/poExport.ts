import { APP_DISPLAY_NAME, APP_FULL_NAME } from "@/config/brand";
import type { TParty, TPurchaseOrder } from "@/api/po";
import { inr } from "@/api/po";

const fileBase = (po: TPurchaseOrder) => po.po_number.replace(/[^A-Za-z0-9-]/g, "_");

function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** CSV cell: quote, and neutralise spreadsheet formulas (=,+,-,@ at the start). */
export function csvCell(v: unknown) {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function poToCsv(po: TPurchaseOrder) {
  const rows: unknown[][] = [
    ["Purchase order", po.po_number],
    ["Date", po.po_date.slice(0, 10)],
    ["Buyer", po.buyer.name],
    ["Buyer address", po.buyer.address],
    ["Buyer GSTIN", po.buyer.gstin],
    ["Supplier", po.supplier?.name ?? ""],
    ["Supplier GSTIN", po.supplier?.gstin ?? ""],
    [],
    ["#", "Item", "Key spec", "Unit", "Qty", "Unit price (INR)", "GST %", "Taxable (INR)", "GST (INR)", "Total (INR)"],
    ...po.lines.map((l) => [l.position, l.title, l.spec ?? "", l.unit, l.quantity, l.unit_price ?? "", l.gst_percent, l.line_subtotal, l.line_tax, l.line_total]),
    [],
    ["", "", "", "", "", "", "", "Subtotal", "", po.subtotal],
    ["", "", "", "", "", "", "", "GST", "", po.tax_total],
    ["", "", "", "", "", "", "", "Grand total", "", po.grand_total],
  ];
  if (po.notes) rows.push([], ["Notes", po.notes]);
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export function downloadPoCsv(po: TPurchaseOrder) {
  save(new Blob(["\uFEFF" + poToCsv(po)], { type: "text/csv;charset=utf-8" }), `${fileBase(po)}.csv`);
}

const partyLines = (p: TParty | null) =>
  p ? [p.name, ...(p.address || "").split(/\n/), p.gstin ? `GSTIN: ${p.gstin}` : "", p.email, p.phone].filter(Boolean) : ["Not specified"];

/** Client-side PDF (no server/Lambda work). jsPDF is loaded only when needed. */
export async function buildPoPdf(po: TPurchaseOrder) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const sea = [4, 23, 38] as [number, number, number];
  doc.setProperties({ title: `Purchase order ${po.po_number}`, creator: APP_DISPLAY_NAME });

  doc.setFillColor(...sea);
  doc.rect(0, 0, W, 64, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PURCHASE ORDER", 40, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${APP_DISPLAY_NAME} · ${APP_FULL_NAME}`, W - 40, 38, { align: "right" });

  doc.setTextColor(11, 31, 46);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`PO number: ${po.po_number}`, 40, 90);
  doc.text(`Date: ${new Date(po.po_date).toLocaleDateString("en-IN")}`, W - 40, 90, { align: "right" });

  const colW = (W - 100) / 2;
  const block = (title: string, lines: string[], x: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(title, x, 116);
    doc.setFont("helvetica", "normal");
    let y = 130;
    for (const l of lines) {
      for (const w of doc.splitTextToSize(l, colW)) {
        doc.text(w, x, y);
        y += 12;
      }
    }
    return y;
  };
  const y1 = block("BUYER", partyLines(po.buyer), 40);
  const y2 = block("SUPPLIER", partyLines(po.supplier), 60 + colW);

  autoTable(doc, {
    startY: Math.max(y1, y2) + 10,
    head: [["#", "Item", "Unit", "Qty", "Unit price", "GST %", "Total (INR)"]],
    body: po.lines.map((l) => [
      l.position,
      l.spec ? `${l.title}\n${l.spec}` : l.title,
      l.unit,
      String(l.quantity),
      l.unit_price === null || l.unit_price === undefined ? "TBC" : inr(Number(l.unit_price)),
      `${l.gst_percent}`,
      l.unit_price === null || l.unit_price === undefined ? "TBC" : inr(l.line_total),
    ]),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 4, textColor: [11, 31, 46] },
    headStyles: { fillColor: [10, 53, 84], textColor: 255 },
    columnStyles: { 0: { cellWidth: 24 }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right" }, 6: { halign: "right" } },
    margin: { left: 40, right: 40 },
  });
  let y = (doc as any).lastAutoTable.finalY + 18;
  const total = (label: string, v: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, W - 180, y);
    doc.text(`INR ${inr(v)}`, W - 40, y, { align: "right" });
    y += 14;
  };
  doc.setFontSize(10);
  total("Subtotal", po.subtotal);
  total("GST", po.tax_total);
  total("Grand total", po.grand_total, true);
  if (po.lines.some((l) => l.unit_price === null || l.unit_price === undefined)) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("TBC: price to be confirmed by the supplier; not included in totals.", 40, y);
    y += 14;
  }
  if (po.notes) {
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Notes", 40, y);
    doc.setFont("helvetica", "normal");
    y += 12;
    doc.text(doc.splitTextToSize(po.notes, W - 80), 40, y);
  }
  const H = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(93, 113, 128);
  doc.text(`Generated with ${APP_DISPLAY_NAME}. Prices in INR.`, 40, H - 24);
  return doc;
}

export async function downloadPoPdf(po: TPurchaseOrder) {
  const doc = await buildPoPdf(po);
  doc.save(`${fileBase(po)}.pdf`);
}
