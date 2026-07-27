import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { useState } from "react";
import { Heart, X, Undo2, Star, Info } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { Bouquet } from "@/lib/bouquets";
import { useWishlist, ratingFor } from "@/lib/wishlist";

export function SwipeDeck({ bouquets }: { bouquets: Bouquet[] }) {
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<{ dir: "left" | "right"; id: string } | null>(null);
  const navigate = useNavigate();
  const { ids, add, remove } = useWishlist();

  const current = bouquets[index];
  const next = bouquets[index + 1];
  const bgTint = current?.tint ?? "#FFFDF9";

  const handleSwipe = (dir: "left" | "right") => {
    if (!current) return;
    if (dir === "left") add(current.id);
    setLastAction({ dir, id: current.id });
    setIndex((i) => i + 1);
  };

  const undo = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
    if (lastAction?.dir === "left") remove(lastAction.id);
    setLastAction(null);
  };

  const openDetail = (id: string) => {
    navigate({ to: "/product/$id", params: { id } });
  };

  return (
    <div
      className="relative min-h-[85vh] w-full overflow-hidden rounded-[36px] transition-colors duration-700"
      style={{
        background: `linear-gradient(160deg, ${bgTint} 0%, #FFFDF9 60%, ${bgTint} 100%)`,
      }}
    >
      <div className="relative mx-auto flex min-h-[85vh] max-w-md flex-col items-center justify-center px-4 py-8">
        <div className="mb-4 text-center">
          <div className="text-xs uppercase tracking-[0.3em] opacity-60">
            {ids.length} saved · {Math.max(bouquets.length - index, 0)} left
          </div>
        </div>

        <div className="relative h-[580px] w-full max-w-sm">
          {next && <StackedCard bouquet={next} depth={1} key={"n-" + next.id} />}

          <AnimatePresence custom={lastAction?.dir}>
            {current ? (
              <SwipeCard
                key={current.id}
                bouquet={current}
                onSwipe={handleSwipe}
                onTap={() => openDetail(current.id)}
              />
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card absolute inset-0 flex flex-col items-center justify-center rounded-[32px] p-8 text-center"
              >
                <div className="text-5xl">🌷</div>
                <div className="mt-4 font-display text-3xl">All bloomed out</div>
                <p className="mt-2 text-sm opacity-70">
                  You saved {ids.length} beautiful {ids.length === 1 ? "bouquet" : "bouquets"}.
                </p>
                <button
                  onClick={() => setIndex(0)}
                  className="btn-rose mt-6 rounded-full px-5 py-2 text-sm"
                >
                  Start over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-6">
          <ActionBtn label="Skip" onClick={() => handleSwipe("right")} tint="#ffffffcc">
            <X size={22} />
          </ActionBtn>
          <ActionBtn label="Undo" onClick={undo} tint="#ffffffcc" small>
            <Undo2 size={18} />
          </ActionBtn>
          <ActionBtn label="Details" onClick={() => current && openDetail(current.id)} tint="#ffffffcc" small>
            <Info size={18} />
          </ActionBtn>
          <ActionBtn label="Save" onClick={() => handleSwipe("left")} tint="var(--tulip)" primary>
            <Heart size={22} fill="white" />
          </ActionBtn>
        </div>

        <p className="mt-4 text-center text-xs opacity-60">
          Swipe <span className="font-medium">left</span> to save · Swipe{" "}
          <span className="font-medium">right</span> to skip · Tap card for details
        </p>
      </div>
    </div>
  );
}

function SwipeCard({
  bouquet,
  onSwipe,
  onTap,
}: {
  bouquet: Bouquet;
  onSwipe: (dir: "left" | "right") => void;
  onTap: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity = useTransform(x, [-200, -40, 0], [1, 0.4, 0]);
  const skipOpacity = useTransform(x, [0, 40, 200], [0, 0.4, 1]);
  const rating = ratingFor(bouquet.id);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab overflow-hidden rounded-[32px] active:cursor-grabbing"
      style={{ x, rotate, boxShadow: "0 30px 80px -30px rgba(183,110,121,0.45)" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onClick={(e) => {
        if (Math.abs(x.get()) < 6) onTap();
      }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -120) onSwipe("left");
        else if (info.offset.x > 120) onSwipe("right");
      }}
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      custom={undefined as "left" | "right" | undefined}
      variants={{
        exit: (dir?: "left" | "right") => ({
          x: (dir === "left" ? -1 : 1) * 500,
          opacity: 0,
          rotate: (dir === "left" ? -1 : 1) * 25,
          transition: { duration: 0.35 },
        }),
      }}
      exit="exit"
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
    >
      <img
        src={bouquet.image}
        alt={bouquet.name}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(30,20,25,0.65) 0%, rgba(30,20,25,0.05) 45%, transparent 100%)",
        }}
      />

      {/* Occasion badge */}
      <div className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
        {bouquet.occasion}
      </div>
      {/* Rating badge */}
      <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold backdrop-blur">
        <Star size={12} className="fill-yellow-500 text-yellow-500" />
        {rating.toFixed(1)}
      </div>

      {/* Overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute left-6 top-16 rounded-full border-2 border-white/90 bg-white/20 px-4 py-1 text-sm font-bold uppercase tracking-widest text-white backdrop-blur"
      >
        ♥ Save
      </motion.div>
      <motion.div
        style={{ opacity: skipOpacity }}
        className="absolute right-6 top-16 rounded-full border-2 border-white/90 bg-white/20 px-4 py-1 text-sm font-bold uppercase tracking-widest text-white backdrop-blur"
      >
        Skip
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="flex items-center gap-1 text-yellow-300">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.round(rating) ? "fill-yellow-300" : "opacity-40"}
            />
          ))}
          <span className="ml-1 text-[11px] text-white/85">{rating.toFixed(1)}</span>
        </div>
        <h3 className="mt-1 font-display text-4xl leading-tight">{bouquet.name}</h3>
        <p className="mt-1 max-w-xs text-sm opacity-90">{bouquet.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {bouquet.flowers.slice(0, 3).map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/40 bg-white/15 px-2.5 py-0.5 text-[11px] backdrop-blur"
              >
                {f}
              </span>
            ))}
          </div>
          <div className="font-display text-2xl">${bouquet.price}</div>
        </div>
      </div>
    </motion.div>
  );
}

function StackedCard({ bouquet, depth }: { bouquet: Bouquet; depth: number }) {
  const scale = 1 - depth * 0.05;
  const y = depth * 12;
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[32px]"
      style={{
        transform: `translateY(${y}px) scale(${scale})`,
        opacity: 0.7,
        boxShadow: "0 20px 50px -30px rgba(183,110,121,0.35)",
      }}
    >
      <img src={bouquet.image} alt="" className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  label,
  tint,
  primary,
  small,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  tint: string;
  primary?: boolean;
  small?: boolean;
}) {
  const size = small ? "h-12 w-12" : "h-16 w-16";
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ y: -3 }}
      className={`${size} grid place-items-center rounded-full transition`}
      style={{
        background: primary ? "var(--gradient-rose-gold)" : tint,
        color: primary ? "white" : "var(--charcoal)",
        boxShadow: primary
          ? "0 15px 30px -10px rgba(183,110,121,0.6)"
          : "0 10px 25px -12px rgba(0,0,0,0.15)",
      }}
    >
      {children}
    </motion.button>
  );
}
