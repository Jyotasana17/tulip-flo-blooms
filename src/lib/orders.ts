import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/cart";

const KEY = "tulipflo:orders";
const EVT = "tulipflo:orders-change";

export type Order = {
  id: string;
  placedAt: string;
  deliveryDate: string;
  items: CartItem[];
  totals: { subtotal: number; giftWrapTotal: number; discountAmount: number; delivery: number; total: number };
  promo?: string;
  recipient: { name: string; address: string; phone: string };
  payment: string;
};

function readAll(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function newOrderId() {
  const n = Math.floor(Math.random() * 90000 + 10000);
  return `TF-${n}`;
}

export function saveOrder(order: Order) {
  writeAll([order, ...readAll()]);
}

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => {
    const load = () => setOrder(getOrder(id) ?? null);
    load();
    window.addEventListener(EVT, load);
    return () => window.removeEventListener(EVT, load);
  }, [id]);
  return order;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const load = () => setOrders(readAll());
    load();
    window.addEventListener(EVT, load);
    return () => window.removeEventListener(EVT, load);
  }, []);
  return orders;
}

export type Stage = {
  key: string;
  label: string;
  emoji: string;
  note: string;
  at: Date;
  done: boolean;
  current: boolean;
};

export function trackingStages(order: Order, now = new Date()): Stage[] {
  const placed = new Date(order.placedAt);
  const delivery = new Date(`${order.deliveryDate}T11:00:00`);
  const span = Math.max(delivery.getTime() - placed.getTime(), 6 * 3600_000);

  const defs = [
    { key: "placed", label: "Order Placed", emoji: "🌱", note: "We received your order and started planning.", t: 0 },
    { key: "crafting", label: "Handcrafting", emoji: "🌿", note: "Our florists are hand-tying your stems.", t: 0.25 },
    { key: "wrapped", label: "Wrapped & Ready", emoji: "🎀", note: "Wrapped, ribboned and misted with fresh water.", t: 0.5 },
    { key: "out", label: "Out for Delivery", emoji: "🚚", note: "Your bouquet is on the road, kept cool en route.", t: 0.8 },
    { key: "delivered", label: "Delivered", emoji: "🌷", note: "Handed over with a signed gift note.", t: 1 },
  ];

  const stages = defs.map((d) => {
    const at = new Date(placed.getTime() + span * d.t);
    return { ...d, at, done: now >= at, current: false };
  });

  const lastDone = stages.reduce((acc, s, i) => (s.done ? i : acc), 0);
  const currentIdx = Math.min(lastDone, stages.length - 1);
  stages[currentIdx].current = true;

  return stages.map(({ key, label, emoji, note, at, done, current }) => ({
    key,
    label,
    emoji,
    note,
    at,
    done,
    current,
  }));
}

export function countdownTo(target: Date, now = new Date()) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  return {
    ms,
    days: Math.floor(ms / 86400_000),
    hours: Math.floor((ms % 86400_000) / 3600_000),
    minutes: Math.floor((ms % 3600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
  };
}
