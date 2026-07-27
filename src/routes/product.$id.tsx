import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowLeft, Heart, ShoppingBag, Zap, Star, Truck, ShieldCheck, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { bouquets, findBouquet } from "@/lib/bouquets";
import { useWishlist, ratingFor } from "@/lib/wishlist";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const b = findBouquet(params.id);
    const name = b?.name ?? "Bouquet";
    return {
      meta: [
        { title: `${name} — Tulip Flo` },
        {
          name: "description",
          content: b
            ? `${b.name} — ${b.description} Handcrafted with ${b.flowers.join(", ")}.`
            : "A handcrafted bouquet from Tulip Flo.",
        },
        { property: "og:title", content: `${name} — Tulip Flo` },
        {
          property: "og:description",
          content: b?.description ?? "Handcrafted bouquets at Tulip Flo.",
        },
      ],
    };
  },
  loader: ({ params }) => {
    const b = findBouquet(params.id);
    if (!b) throw notFound();
    return { id: params.id };
  },
  component: ProductDetail,
});

const SIZES = [
  { key: "mini", label: "Mini", mult: 0.7 },
  { key: "medium", label: "Medium", mult: 1.0 },
  { key: "large", label: "Large", mult: 1.35 },
  { key: "premium", label: "Premium", mult: 1.8 },
] as const;

const RIBBONS = [
  { key: "blush", label: "Blush", color: "#F7C8CE" },
  { key: "ivory", label: "Ivory", color: "#F5EDE7" },
  { key: "lavender", label: "Lavender", color: "#E9DDF7" },
  { key: "rose-gold", label: "Rose Gold", color: "#EAA896" },
  { key: "sage", label: "Sage", color: "#DCE9DD" },
];

const WRAPS = [
  { key: "kraft", label: "Kraft Paper", swatch: "linear-gradient(135deg,#D9B99B,#B48A6B)" },
  { key: "silk", label: "Silk Ivory", swatch: "linear-gradient(135deg,#FFFDF9,#F5EDE7)" },
  { key: "lace", label: "Lace Blush", swatch: "linear-gradient(135deg,#F9E7EA,#F7C8CE)" },
];

const REVIEWS = [
  { name: "Aisha K.", stars: 5, text: "Absolutely breathtaking — the wrapping felt like a gift within a gift." },
  { name: "Marcus P.", stars: 5, text: "She cried happy tears. Delivered on time and even fresher than expected." },
  { name: "Lina H.", stars: 4, text: "Beautiful bouquet, arrived a little smaller than I imagined but stunning." },
];

function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const b = findBouquet(id)!;
  const rating = ratingFor(b.id);
  const { has, toggle } = useWishlist();
  const saved = has(b.id);

  const [size, setSize] = useState<(typeof SIZES)[number]["key"]>("medium");
  const [ribbon, setRibbon] = useState(RIBBONS[0].key);
  const [wrap, setWrap] = useState(WRAPS[1].key);
  const [greeting, setGreeting] = useState("");
  const [giftNote, setGiftNote] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(false);

  const finalPrice = useMemo(() => {
    const mult = SIZES.find((s) => s.key === size)!.mult;
    return Math.round(b.price * mult);
  }, [b.price, size]);

  const gallery = [b.image, b.image, b.image, b.image];

  const related = bouquets.filter((x) => x.id !== b.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-4 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm glass-card"
          style={{ color: "var(--charcoal)" }}
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery */}
          <div>
            <motion.div
              layout
              className="relative aspect-square w-full overflow-hidden rounded-[32px]"
              style={{
                background: `linear-gradient(160deg, ${b.tint} 0%, #fffdf9 100%)`,
                boxShadow: "0 30px 60px -30px rgba(183,110,121,0.35)",
              }}
              onClick={() => setZoom((z) => !z)}
            >
              <motion.img
                key={activeImg}
                src={gallery[activeImg]}
                alt={b.name}
                className="h-full w-full cursor-zoom-in object-cover"
                animate={{ scale: zoom ? 1.6 : 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
                360°
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold">
                Tap to zoom
              </div>
            </motion.div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-2xl transition ${
                    activeImg === i ? "ring-2 ring-[color:var(--tulip)]" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="text-xs uppercase tracking-[0.3em] opacity-60">{b.occasion}</div>
            <h1 className="mt-1 font-display text-5xl leading-tight md:text-6xl">{b.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(rating) ? "fill-yellow-500" : "opacity-40"} />
                ))}
              </div>
              <span className="text-sm opacity-70">
                {rating.toFixed(1)} · {REVIEWS.length} reviews
              </span>
              <span
                className="ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ background: "var(--sage)", color: "var(--charcoal)" }}
              >
                In stock
              </span>
            </div>

            <p className="mt-4 max-w-lg text-base opacity-80">{b.description}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-5xl text-rose-gold">${finalPrice}</span>
              <span className="text-sm line-through opacity-50">${Math.round(finalPrice * 1.15)}</span>
              <span className="text-xs font-semibold text-emerald-600">-15%</span>
            </div>

            {/* Flowers */}
            <div className="mt-6">
              <div className="text-xs uppercase tracking-[0.25em] opacity-60">Handcrafted with</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {b.flowers.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{ borderColor: "var(--border)", background: "white" }}
                  >
                    ✿ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Size */}
            <Section title="Size">
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSize(s.key)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      size === s.key ? "text-white shadow-md" : "glass-card"
                    }`}
                    style={size === s.key ? { background: "var(--gradient-rose-gold)" } : {}}
                  >
                    {s.label} · ${Math.round(b.price * s.mult)}
                  </button>
                ))}
              </div>
            </Section>

            {/* Ribbon */}
            <Section title="Ribbon color">
              <div className="flex flex-wrap gap-3">
                {RIBBONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setRibbon(r.key)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition ${
                      ribbon === r.key ? "ring-2 ring-[color:var(--tulip)]" : "glass-card"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-white/60"
                      style={{ background: r.color }}
                    />
                    {r.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Wrap */}
            <Section title="Wrapping paper">
              <div className="grid grid-cols-3 gap-3">
                {WRAPS.map((w) => (
                  <button
                    key={w.key}
                    onClick={() => setWrap(w.key)}
                    className={`overflow-hidden rounded-2xl p-0.5 transition ${
                      wrap === w.key ? "ring-2 ring-[color:var(--tulip)]" : ""
                    }`}
                  >
                    <div
                      className="flex h-16 items-end rounded-2xl p-2 text-[11px] font-medium text-white"
                      style={{ background: w.swatch }}
                    >
                      <span
                        className="rounded-full bg-black/30 px-2 py-0.5 backdrop-blur"
                      >
                        {w.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            {/* Greeting card */}
            <Section title="Greeting card message">
              <textarea
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                maxLength={140}
                placeholder="Write a little love note…"
                className="w-full resize-none rounded-2xl border border-[color:var(--border)] bg-white/70 p-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--tulip)]"
                rows={3}
              />
              <div className="mt-1 flex items-center justify-between text-xs opacity-60">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={giftNote}
                    onChange={(e) => setGiftNote(e.target.checked)}
                  />
                  Include a signed gift note
                </label>
                <span>{greeting.length}/140</span>
              </div>
            </Section>

            {/* Delivery */}
            <Section title="Delivery date">
              <label className="flex items-center gap-2 rounded-full px-3 py-2 glass-card">
                <Calendar size={16} />
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                />
              </label>
            </Section>

            {/* Meta info */}
            <div className="mt-6 grid grid-cols-1 gap-2 rounded-2xl p-4 sm:grid-cols-3 glass-card">
              <Meta icon={<Truck size={16} />} label="Free delivery" sub="Orders over $60" />
              <Meta icon={<ShieldCheck size={16} />} label="COD available" sub="Pay on delivery" />
              <Meta icon={<Calendar size={16} />} label="Est. arrival" sub={deliveryDate} />
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => toggle(b.id)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
                  saved ? "text-white" : "glass-card"
                }`}
                style={saved ? { background: "var(--gradient-rose-gold)" } : { color: "var(--charcoal)" }}
              >
                <Heart size={16} fill={saved ? "white" : "none"} />
                {saved ? "Saved" : "Wishlist"}
              </button>
              <button
                className="btn-rose inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium glass-card"
                style={{ color: "var(--charcoal)" }}
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="font-display text-3xl md:text-4xl">
            What customers <span className="italic text-rose-gold">say</span>
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-3xl p-5 glass-card">
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-500" />
                  ))}
                </div>
                <p className="mt-2 text-sm opacity-85">"{r.text}"</p>
                <div className="mt-3 text-xs uppercase tracking-widest opacity-60">
                  — {r.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mt-16">
          <h2 className="font-display text-3xl md:text-4xl">
            You may also <span className="italic text-rose-gold">love</span>
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/product/$id"
                params={{ id: r.id }}
                className="group relative overflow-hidden rounded-3xl"
                style={{ boxShadow: "0 20px 40px -25px rgba(183,110,121,0.35)" }}
              >
                <img
                  src={r.image}
                  alt={r.name}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="rounded-2xl px-3 py-2 glass-card">
                    <div className="font-display text-base leading-tight">{r.name}</div>
                    <div className="mt-0.5 flex items-center justify-between text-[11px] opacity-70">
                      <span>{r.occasion}</span>
                      <span className="font-semibold">${r.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-[0.25em] opacity-60">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Meta({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="grid h-9 w-9 place-items-center rounded-full"
        style={{ background: "var(--blush)", color: "var(--charcoal)" }}
      >
        {icon}
      </span>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] opacity-70">{sub}</div>
      </div>
    </div>
  );
}
