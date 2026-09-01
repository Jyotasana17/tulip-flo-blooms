import type { Order } from "@/lib/orders";
import { unitPrice } from "@/lib/cart";
import { findBouquet } from "@/lib/bouquets";
import { labelFor, RIBBONS, WRAPS } from "@/lib/options";

/** Minimal, dependency-free PDF writer (Helvetica text lines). */
function buildPdf(lines: { text: string; size: number; bold?: boolean }[]) {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  let y = 800;
  let content = "";
  for (const l of lines) {
    if (l.text === "") {
      y -= l.size;
      continue;
    }
    content += `BT /${l.bold ? "F2" : "F1"} ${l.size} Tf 56 ${y} Td (${esc(l.text)}) Tj ET\n`;
    y -= l.size + 6;
  }

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

export function downloadInvoice(order: Order) {
  const money = (n: number) => `$${n}`;
  const lines: { text: string; size: number; bold?: boolean }[] = [
    { text: "TULIP FLO", size: 22, bold: true },
    { text: "Luxury Handmade Bouquets", size: 11 },
    { text: "", size: 10 },
    { text: `Invoice ${order.id}`, size: 15, bold: true },
    { text: `Placed: ${new Date(order.placedAt).toLocaleString()}`, size: 10 },
    { text: `Delivery date: ${order.deliveryDate}`, size: 10 },
    { text: `Payment: ${order.payment}`, size: 10 },
    { text: "", size: 8 },
    { text: "Recipient", size: 13, bold: true },
    { text: order.recipient.name, size: 10 },
    { text: order.recipient.address, size: 10 },
    { text: order.recipient.phone, size: 10 },
    { text: "", size: 8 },
    { text: "Items", size: 13, bold: true },
  ];

  for (const i of order.items) {
    const b = findBouquet(i.id);
    lines.push({ text: `${b?.name ?? i.id}  x${i.qty}   ${money(unitPrice(i) * i.qty)}`, size: 11, bold: true });
    lines.push({
      text: `   Size: ${i.size} | Ribbon: ${labelFor(RIBBONS, i.ribbon)} | Wrap: ${labelFor(WRAPS, i.wrap)}${i.giftWrap ? " | Gift wrapped" : ""}`,
      size: 9,
    });
    if (i.greeting) lines.push({ text: `   Card: "${i.greeting}"`, size: 9 });
  }

  lines.push({ text: "", size: 8 });
  lines.push({ text: "Summary", size: 13, bold: true });
  lines.push({ text: `Subtotal: ${money(order.totals.subtotal)}`, size: 10 });
  if (order.totals.discountAmount)
    lines.push({ text: `Discount${order.promo ? ` (${order.promo})` : ""}: -${money(order.totals.discountAmount)}`, size: 10 });
  lines.push({ text: `Delivery: ${order.totals.delivery ? money(order.totals.delivery) : "Free"}`, size: 10 });
  lines.push({ text: `Total: ${money(order.totals.total)}`, size: 14, bold: true });
  lines.push({ text: "", size: 10 });
  lines.push({ text: "Thank you for letting us bloom for you.", size: 11 });

  const blob = new Blob([buildPdf(lines)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TulipFlo-Invoice-${order.id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
