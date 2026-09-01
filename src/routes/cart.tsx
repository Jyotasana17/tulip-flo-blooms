import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Gift,
  Minus,
  Plus,
  Trash2,
  Ticket,
  Truck,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { findBouquet } from "@/lib/bouquets";
import { cartTotals, unitPrice, useCart, type CartItem } from "@/lib/cart";
import { GIFT_WRAP_FEE, PROMOS, RIBBONS, SIZES, WRAPS, labelFor } from "@/lib/options";
import { newOrderId, saveOrder } from "@/lib/orders";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Tulip Flo" },
      {
        name: "description",
        content:
          "Review your handcrafted bouquets, personalise size, ribbon, wrapping and greeting card, then check out in a few taps.",
      },
      { property: "og:title", content: "Your Cart — Tulip Flo" },
      {
        property: "og:description",
        content: "Personalise every bouquet — size, ribbon, wrapping and a signed greeting card.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, update, clear } = useCart();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const discount = promo ? PROMOS[promo].off : 0;
  const totals = useMemo(() => cartTotals(items, discount), [items, discount]);
  const giftWrapped = items.filter((i) => i.giftWrap).length;

  const applyCode = () => {
    const key = code.trim().toUpperCase();
    if (PROMOS[key]) {
      setPromo(key);
      setCode("");
    } else {
      setPromo(null);
    }
  };

  const placeOrder = () => {
    if (items.length === 0) return;
    setPlacing(true);
    const id = newOrderId();
    const deliveryDate =
      items.map((i) => i.deliveryDate).sort()[0] ??
      new Date(Date.now() + 2 * 86400_000).toISOString().slice(0, 10);
    saveOrder({
      id,
      placedAt: new Date().toISOString(),
      deliveryDate,
      items,
      totals,
      promo: promo ?? undefined,
      recipient: {
        name: "Tulip Flo Guest",
        address: "12 Rose Garden Lane, Apt 4B, Bloomsbury",
        phone: "+1 (555) 014-9928",
      },
      payment: "Card ending 4242",
    });
    clear();
    navigate({ to: "/order/$id", params: { id } });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-4 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm glass-card"
          style={{ color: "var(--charcoal)" }}
        >
          <ArrowLeft size={16} /> Continue shopping
        </Link>

        <header className="mt-8">
          <p className="text-xs uppercase tracking-[0.35em] opacity-60">Your selection</p>
          <h1 className="font-display text-4xl italic md:text-5xl">
            <span className="text-rose-gold">Shopping Cart</span>
          </h1>
          <p className="mt-2 text-sm opacity-70">
            {items.length === 0
              ? "Nothing here yet — the florists are waiting."
              : `${items.length} bouquet${items.length > 1 ? "s" : ""} ready to be wrapped${
                  giftWrapped ? ` · ${giftWrapped} gift wrapped` : ""
                }`}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl p-12 text-center glass-card">
            <div className="text-5xl">🧺</div>
            <h2 className="mt-4 font-display text-2xl italic">Your cart is beautifully empty</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm opacity-70">
              Browse our handcrafted collections and add a bouquet — you can personalise every detail here.
            </p>
            <Link
              to="/browse/$category"
              params={{ category: "premium" }}
              className="btn-rose mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              <Sparkles size={16} /> Explore bouquets
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              {items.map((item, idx) => (
                <CartRow
                  key={item.key}
                  item={item}
                  index={idx}
                  onQty={(q) => setQty(item.key, q)}
                  onRemove={() => remove(item.key)}
                  onUpdate={(patch) => update(item.key, patch)}
                />
              ))}
              <button
                onClick={clear}
                className="rounded-full px-4 py-2 text-xs opacity-70 transition hover:opacity-100 glass-card"
              >
                Clear cart
              </button>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl p-6 glass-card">
                <h2 className="font-display text-2xl italic">Order summary</h2>

                <div className="mt-4 flex items-center gap-2 rounded-full px-3 py-2 glass-card">
                  <Ticket size={16} className="opacity-70" />
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyCode()}
                    placeholder="Promo code (try BLOOM10)"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--muted-foreground)]"
                  />
                  <button onClick={applyCode} className="text-xs font-semibold text-rose-gold">
                    Apply
                  </button>
                </div>
                {promo && (
                  <p className="mt-2 text-xs" style={{ color: "var(--rose-gold-2)" }}>
                    {PROMOS[promo].label} applied
                  </p>
                )}

                <dl className="mt-5 space-y-2 text-sm">
                  <Line label="Subtotal" value={`$${totals.subtotal}`} />
                  {totals.giftWrapTotal > 0 && (
                    <Line label="Gift wrapping" value={`$${totals.giftWrapTotal} included`} muted />
                  )}
                  {totals.discountAmount > 0 && (
                    <Line label={`Discount (${promo})`} value={`-$${totals.discountAmount}`} accent />
                  )}
                  <Line
                    label="Delivery"
                    value={totals.delivery === 0 ? "Free" : `$${totals.delivery}`}
                    muted={totals.delivery === 0}
                  />
                  <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-baseline justify-between">
                      <dt className="font-display text-xl italic">Total</dt>
                      <dd className="font-display text-2xl italic text-rose-gold">${totals.total}</dd>
                    </div>
                  </div>
                </dl>

                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="btn-rose mt-6 w-full rounded-full px-6 py-3 text-sm font-medium disabled:opacity-60"
                >
                  {placing ? "Placing order…" : "Place order"}
                </button>

                <div className="mt-5 space-y-3 text-xs">
                  <Perk icon={<Truck size={14} />} text="Free delivery on orders over $60" />
                  <Perk icon={<ShieldCheck size={14} />} text="Freshness guarantee, 7 days" />
                  <Perk icon={<Gift size={14} />} text="Hand-signed gift note included" />
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function CartRow({
  item,
  index,
  onQty,
  onRemove,
  onUpdate,
}: {
  item: CartItem;
  index: number;
  onQty: (q: number) => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<CartItem>) => void;
}) {
  const b = findBouquet(item.id);
  const [open, setOpen] = useState(false);
  if (!b) return null;
  const price = unitPrice(item);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="overflow-hidden rounded-3xl glass-card"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <Link
          to="/product/$id"
          params={{ id: b.id }}
          className="relative block h-32 w-full shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28"
          style={{ background: item.giftWrap ? "var(--gradient-rose-gold)" : b.tint }}
        >
          <img src={b.image} alt={b.name} className="h-full w-full object-cover" loading="lazy" />
          {item.giftWrap && (
            <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: "var(--gradient-rose-gold)" }}>
              <Gift size={12} />
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl italic">{b.name}</h3>
              <p className="text-xs opacity-60">{b.occasion} · {b.flowers.join(", ")}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl italic text-rose-gold">${price * item.qty}</p>
              <p className="text-[11px] opacity-60">${price} each</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <Chip>{labelFor(SIZES as unknown as { key: string; label: string }[], item.size)}</Chip>
            <Chip>
              <span
                className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ background: RIBBONS.find((r) => r.key === item.ribbon)?.color }}
              />
              {labelFor(RIBBONS, item.ribbon)} ribbon
            </Chip>
            <Chip>{labelFor(WRAPS, item.wrap)}</Chip>
            <Chip>
              <Calendar size={11} className="mr-1 inline align-middle" />
              {item.deliveryDate}
            </Chip>
            {item.giftWrap && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-white"
                style={{ background: "var(--gradient-rose-gold)" }}
              >
                <Gift size={11} /> Gift wrapped +${GIFT_WRAP_FEE}
              </span>
            )}
          </div>

          {item.greeting && (
            <p className="mt-3 rounded-2xl bg-white/60 p-3 text-xs italic opacity-80">“{item.greeting}”</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full px-1 py-1 glass-card">
              <QtyBtn label="Decrease quantity" onClick={() => onQty(item.qty - 1)}>
                <Minus size={14} />
              </QtyBtn>
              <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
              <QtyBtn label="Increase quantity" onClick={() => onQty(item.qty + 1)}>
                <Plus size={14} />
              </QtyBtn>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen((o) => !o)}
                className="rounded-full px-4 py-2 text-xs font-medium glass-card"
                style={{ color: "var(--charcoal)" }}
              >
                {open ? "Done" : "Customise"}
              </button>
              <button
                onClick={onRemove}
                aria-label="Remove item"
                className="grid h-9 w-9 place-items-center rounded-full glass-card"
                style={{ color: "var(--charcoal)" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t px-4 pb-5 pt-4 sm:px-5"
          style={{ borderColor: "var(--border)" }}
        >
          <Field label="Size">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => onUpdate({ size: s.key })}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    item.size === s.key ? "text-white shadow-md" : "glass-card"
                  }`}
                  style={item.size === s.key ? { background: "var(--gradient-rose-gold)" } : {}}
                >
                  {s.label} · ${Math.round(b.price * s.mult)}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Ribbon">
            <div className="flex flex-wrap gap-2">
              {RIBBONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => onUpdate({ ribbon: r.key })}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs transition ${
                    item.ribbon === r.key ? "ring-2 ring-[color:var(--tulip)]" : "glass-card"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: r.color }} />
                  {r.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Wrapping">
            <div className="flex flex-wrap gap-2">
              {WRAPS.map((w) => (
                <button
                  key={w.key}
                  onClick={() => onUpdate({ wrap: w.key })}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs transition ${
                    item.wrap === w.key ? "ring-2 ring-[color:var(--tulip)]" : "glass-card"
                  }`}
                >
                  <span className="h-3 w-6 rounded-full" style={{ background: w.swatch }} />
                  {w.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Greeting card">
            <textarea
              value={item.greeting}
              onChange={(e) => onUpdate({ greeting: e.target.value.slice(0, 140) })}
              rows={2}
              placeholder="Write a little love note…"
              className="w-full resize-none rounded-2xl border bg-white/70 p-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--tulip)]"
              style={{ borderColor: "var(--border)" }}
            />
            <div className="mt-1 text-right text-[11px] opacity-60">{item.greeting.length}/140</div>
          </Field>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={item.giftWrap}
                onChange={(e) => onUpdate({ giftWrap: e.target.checked })}
              />
              Luxury gift wrap (+${GIFT_WRAP_FEE})
            </label>
            <label className="flex items-center gap-2 rounded-full px-3 py-2 text-xs glass-card">
              <Calendar size={14} />
              <input
                type="date"
                value={item.deliveryDate}
                onChange={(e) => onUpdate({ deliveryDate: e.target.value })}
                className="bg-transparent outline-none"
              />
            </label>
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/70 px-2.5 py-1">{children}</span>;
}

function QtyBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full bg-white/70 transition active:scale-95"
      style={{ color: "var(--charcoal)" }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 first:mt-0">
      <p className="mb-2 text-[11px] uppercase tracking-[0.25em] opacity-60">{label}</p>
      {children}
    </div>
  );
}

function Line({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? "opacity-60" : "opacity-80"}>{label}</dt>
      <dd className={accent ? "font-semibold" : ""} style={accent ? { color: "var(--rose-gold-2)" } : {}}>
        {value}
      </dd>
    </div>
  );
}

function Perk({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 opacity-75">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/70">{icon}</span>
      {text}
    </div>
  );
}
