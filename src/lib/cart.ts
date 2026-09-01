import { useCallback, useEffect, useState } from "react";
import { GIFT_WRAP_FEE, sizeMult } from "@/lib/options";
import { findBouquet } from "@/lib/bouquets";

const KEY = "tulipflo:cart";
const EVT = "tulipflo:cart-change";

export type CartItem = {
  key: string;
  id: string;
  size: string;
  ribbon: string;
  wrap: string;
  greeting: string;
  giftWrap: boolean;
  deliveryDate: string;
  qty: number;
};

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function itemKey(i: Omit<CartItem, "key" | "qty">) {
  return [i.id, i.size, i.ribbon, i.wrap, i.giftWrap ? "gw" : "ng", i.greeting].join("|");
}

export function unitPrice(item: CartItem) {
  const b = findBouquet(item.id);
  const base = b ? Math.round(b.price * sizeMult(item.size)) : 0;
  return base + (item.giftWrap ? GIFT_WRAP_FEE : 0);
}

export function cartTotals(items: CartItem[], discount = 0) {
  const subtotal = items.reduce((s, i) => s + unitPrice(i) * i.qty, 0);
  const giftWrapTotal = items.reduce((s, i) => s + (i.giftWrap ? GIFT_WRAP_FEE * i.qty : 0), 0);
  const discountAmount = Math.round(subtotal * discount);
  const afterDiscount = subtotal - discountAmount;
  const delivery = afterDiscount === 0 || afterDiscount >= 60 ? 0 : 9;
  const total = afterDiscount + delivery;
  return { subtotal, giftWrapTotal, discountAmount, delivery, total };
}

export function addToCart(item: Omit<CartItem, "key" | "qty">, qty = 1) {
  const items = read();
  const key = itemKey(item);
  const found = items.find((i) => i.key === key);
  if (found) found.qty += qty;
  else items.push({ ...item, key, qty });
  write(items);
}

export function clearCart() {
  write([]);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const handler = () => setItems(read());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    const next = read()
      .map((i) => (i.key === key ? { ...i, qty: Math.max(0, qty) } : i))
      .filter((i) => i.qty > 0);
    write(next);
  }, []);

  const remove = useCallback((key: string) => {
    write(read().filter((i) => i.key !== key));
  }, []);

  const update = useCallback((key: string, patch: Partial<CartItem>) => {
    const items = read();
    const idx = items.findIndex((i) => i.key === key);
    if (idx < 0) return;
    const merged = { ...items[idx], ...patch };
    const newKey = itemKey(merged);
    const dupe = items.findIndex((i) => i.key === newKey && i.key !== key);
    if (dupe >= 0) {
      items[dupe].qty += merged.qty;
      items.splice(idx, 1);
    } else {
      items[idx] = { ...merged, key: newKey };
    }
    write(items);
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);

  return { items, count, setQty, remove, update, clear: clearCart };
}
