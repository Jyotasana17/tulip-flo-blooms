import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowLeft, Heart, ShoppingBag, Trash2, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { bouquets, findBouquet } from "@/lib/bouquets";
import { useWishlist, ratingFor } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Tulip Flo" },
      {
        name: "description",
        content: "Bouquets you've saved for later at Tulip Flo — handcrafted florals waiting to be gifted.",
      },
      { property: "og:title", content: "Your Wishlist — Tulip Flo" },
      { property: "og:description", content: "Handcrafted bouquets saved to your Tulip Flo wishlist." },
    ],
  }),
  component: WishlistPage,
});

type Sort = "newest" | "price-low" | "price-high" | "rating";
type Filter = "all" | "in-stock" | "premium" | "mini";

function WishlistPage() {
  const { ids, remove } = useWishlist();
  const [sort, setSort] = useState<Sort>("newest");
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    let list = ids
      .map((id) => findBouquet(id))
      .filter((x): x is NonNullable<typeof x> => !!x);

    if (filter === "premium") list = list.filter((b) => b.categories.includes("premium"));
    if (filter === "mini") list = list.filter((b) => b.categories.includes("mini"));
    // "in-stock" everything is in stock in demo data

    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => ratingFor(b.id) - ratingFor(a.id));
    return list;
  }, [ids, sort, filter]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm glass-card"
            style={{ color: "var(--charcoal)" }}
          >
            <ArrowLeft size={16} /> Back home
          </Link>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.3em] opacity-60">Saved</div>
            <div className="font-display text-2xl md:text-3xl">
              ❤️ {ids.length} bouquet{ids.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="font-display text-5xl leading-tight md:text-6xl">
            Your <span className="italic text-rose-gold">wishlist</span>
          </h1>
          <p className="mt-2 max-w-md text-sm opacity-70">
            Little love letters waiting to be gifted. Ready when you are.
          </p>
        </div>

        {/* Filters */}
        {ids.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(["all", "in-stock", "premium", "mini"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  filter === f ? "text-white" : "glass-card"
                }`}
                style={filter === f ? { background: "var(--gradient-rose-gold)" } : {}}
              >
                {f === "all" ? "All" : f === "in-stock" ? "In stock" : f === "premium" ? "Premium" : "Mini"}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 rounded-full px-3 py-1.5 text-xs glass-card">
              <span className="opacity-60">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-transparent text-xs outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price · Low to high</option>
                <option value="price-high">Price · High to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>
        )}

        {/* Empty state */}
        {ids.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-[32px] p-10 text-center glass-card"
          >
            <div className="text-6xl">💐</div>
            <div className="mt-4 font-display text-3xl">Nothing saved yet</div>
            <p className="mx-auto mt-2 max-w-md text-sm opacity-70">
              Start swiping through our handcrafted bouquets. Swipe left on the ones that steal
              your heart — they'll all bloom right here.
            </p>
            <Link
              to="/browse/$category"
              params={{ category: "premium" }}
              className="btn-rose mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
            >
              Start swiping <span>→</span>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {items.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {items.map((b) => (
                <motion.article
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  className="group relative overflow-hidden rounded-[28px]"
                  style={{
                    background: `linear-gradient(160deg, ${b.tint} 0%, #fffdf9 100%)`,
                    boxShadow: "0 25px 55px -30px rgba(183,110,121,0.4)",
                  }}
                >
                  <Link to="/product/$id" params={{ id: b.id }} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={b.image}
                        alt={b.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span
                        className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ background: "var(--sage)", color: "var(--charcoal)" }}
                      >
                        In stock
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                        ★ {ratingFor(b.id).toFixed(1)}
                      </span>
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.25em] opacity-60">
                          {b.occasion}
                        </div>
                        <h3 className="font-display text-2xl leading-tight">{b.name}</h3>
                      </div>
                      <div className="font-display text-2xl text-rose-gold">${b.price}</div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs opacity-70">{b.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        className="btn-rose inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium"
                      >
                        <ShoppingBag size={13} /> Move to cart
                      </button>
                      <button
                        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium glass-card"
                        style={{ color: "var(--charcoal)" }}
                      >
                        <Zap size={13} /> Buy now
                      </button>
                      <button
                        onClick={() => remove(b.id)}
                        aria-label={`Remove ${b.name}`}
                        className="ml-auto grid h-8 w-8 place-items-center rounded-full glass-card transition hover:text-red-500"
                        style={{ color: "var(--charcoal)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Suggestions */}
        {ids.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl md:text-4xl">
              You might also <span className="italic text-rose-gold">love</span>
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {bouquets
                .filter((b) => !ids.includes(b.id))
                .slice(0, 4)
                .map((b) => (
                  <Link
                    key={b.id}
                    to="/product/$id"
                    params={{ id: b.id }}
                    className="group overflow-hidden rounded-3xl"
                    style={{ boxShadow: "0 20px 40px -25px rgba(183,110,121,0.35)" }}
                  >
                    <div className="relative">
                      <img
                        src={b.image}
                        alt={b.name}
                        className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="rounded-2xl px-3 py-2 glass-card">
                          <div className="font-display text-base leading-tight">{b.name}</div>
                          <div className="mt-0.5 flex items-center justify-between text-[11px] opacity-70">
                            <span>{b.occasion}</span>
                            <span className="font-semibold">${b.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
