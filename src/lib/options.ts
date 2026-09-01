export const SIZES = [
  { key: "mini", label: "Mini", mult: 0.7 },
  { key: "medium", label: "Medium", mult: 1.0 },
  { key: "large", label: "Large", mult: 1.35 },
  { key: "premium", label: "Premium", mult: 1.8 },
] as const;

export const RIBBONS = [
  { key: "blush", label: "Blush", color: "#F7C8CE" },
  { key: "ivory", label: "Ivory", color: "#F5EDE7" },
  { key: "lavender", label: "Lavender", color: "#E9DDF7" },
  { key: "rose-gold", label: "Rose Gold", color: "#EAA896" },
  { key: "sage", label: "Sage", color: "#DCE9DD" },
];

export const WRAPS = [
  { key: "kraft", label: "Kraft Paper", swatch: "linear-gradient(135deg,#D9B99B,#B48A6B)" },
  { key: "silk", label: "Silk Ivory", swatch: "linear-gradient(135deg,#FFFDF9,#F5EDE7)" },
  { key: "lace", label: "Lace Blush", swatch: "linear-gradient(135deg,#F9E7EA,#F7C8CE)" },
];

export const GIFT_WRAP_FEE = 6;

export function sizeMult(key: string) {
  return SIZES.find((s) => s.key === key)?.mult ?? 1;
}

export function labelFor(list: { key: string; label: string }[], key: string) {
  return list.find((x) => x.key === key)?.label ?? key;
}

export const PROMOS: Record<string, { off: number; label: string }> = {
  BLOOM10: { off: 0.1, label: "10% off — Bloom welcome" },
  TULIP20: { off: 0.2, label: "20% off — Tulip lovers" },
  LUXE15: { off: 0.15, label: "15% off — Luxe collection" },
};
