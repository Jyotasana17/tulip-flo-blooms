import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import heroImg from "@/assets/hero-bouquet.jpg";
import { bouquets, categories } from "@/lib/bouquets";
import { Navbar } from "./Navbar";
import { PetalField } from "./PetalField";

function countFor(slug: string) {
  const real = bouquets.filter((b) => b.categories.includes(slug)).length;
  // Curated display counts to feel like a real boutique catalogue.
  const bump: Record<string, number> = {
    large: 24, medium: 19, mini: 15, wedding: 18, anniversary: 22,
    birthday: 31, graduation: 12, "baby-shower": 14, surprise: 17,
    sunflower: 9, roses: 28, tulips: 21, premium: 11,
  };
  return bump[slug] ?? Math.max(real, 6);
}

export function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="relative min-h-screen">
      <PetalField count={14} opacity={0.5} />
      <Navbar />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-2 md:gap-16 md:pt-16"
      >
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] glass-card">
            <span>✿</span> Handcrafted florals
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            Every Bouquet
            <br />
            <span className="italic text-rose-gold">Tells A Story</span>
          </h1>
          <p
            className="mt-6 max-w-md text-base md:text-lg"
            style={{ color: "color-mix(in oklab, var(--charcoal) 70%, transparent)" }}
          >
            Handcrafted flowers for every unforgettable moment — arranged by
            hand, delivered like a heartfelt gift.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/browse/$category"
              params={{ category: "premium" }}
              className="btn-rose inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              Explore Collection <span>→</span>
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium glass-card"
              style={{ color: "var(--charcoal)" }}
            >
              Browse categories
            </a>
          </div>
        </motion.div>

        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="absolute -inset-6 rounded-[40px] blur-2xl"
            style={{ background: "var(--gradient-petal)" }}
          />
          <motion.div
            className="relative overflow-hidden rounded-[36px] shadow-[var(--shadow-petal)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={heroImg}
              alt="A handmade bouquet of tulips, roses, lavender and baby's breath"
              width={1600}
              height={1200}
              className="h-[520px] w-full object-cover md:h-[600px]"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl px-4 py-3 glass-card">
              <div className="flex items-center justify-between text-sm">
                <span className="font-display text-xl italic">Signature Blush</span>
                <span className="font-medium">from $89</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-6 pb-28">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl md:text-5xl">
              Find your <span className="italic text-rose-gold">bloom</span>
            </h2>
            <p
              className="mt-2 max-w-md text-sm md:text-base"
              style={{ color: "color-mix(in oklab, var(--charcoal) 65%, transparent)" }}
            >
              Swipe through categories, discover bouquets like little love letters.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {categories.map((c, i) => {
            const count = countFor(c.slug);
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.03 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to="/browse/$category"
                  params={{ category: c.slug }}
                  className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-3xl p-5 transition"
                  style={{
                    background: `linear-gradient(160deg, ${c.color} 0%, #fffdf9 100%)`,
                    boxShadow: "0 20px 40px -25px rgba(183,110,121,0.35)",
                  }}
                >
                  {/* soft bloom on hover */}
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), transparent 60%)",
                    }}
                  />
                  <motion.span
                    className="text-5xl md:text-6xl"
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 220, damping: 12 }}
                  >
                    {c.emoji}
                  </motion.span>

                  {/* Glass overlay with details */}
                  <div className="relative">
                    <div className="rounded-2xl px-3 py-2.5 glass-card">
                      <div className="font-display text-lg leading-tight md:text-xl">
                        {c.name}
                      </div>
                      <div className="mt-0.5 text-[11px] opacity-70">{c.blurb}</div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span
                          className="rounded-full px-2 py-0.5 font-medium"
                          style={{
                            background: "rgba(255,255,255,0.6)",
                            color: "var(--charcoal)",
                          }}
                        >
                          {count} Designs
                        </span>
                        <span className="opacity-60">Explore →</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full opacity-40 blur-2xl transition group-hover:opacity-70"
                    style={{ background: "white" }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-[color:var(--border)] bg-white/40 py-10 text-center text-sm backdrop-blur">
        <p className="font-display text-2xl italic">Tulip Flo</p>
        <p className="mt-1 opacity-70">Crafted with love · Delivered like a gift 🌷</p>
      </footer>
    </div>
  );
}
