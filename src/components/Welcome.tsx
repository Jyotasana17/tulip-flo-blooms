import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";

const FRAME_FLOWERS = [
  { icon: "🌷", top: "4%", left: "6%", size: 56, delay: 0.2 },
  { icon: "🌹", top: "6%", right: "8%", size: 62, delay: 0.4 },
  { icon: "🌸", top: "22%", left: "2%", size: 44, delay: 0.6 },
  { icon: "🍃", top: "28%", right: "4%", size: 50, delay: 0.5 },
  { icon: "💐", bottom: "6%", left: "8%", size: 68, delay: 0.7 },
  { icon: "🌼", bottom: "10%", right: "10%", size: 52, delay: 0.9 },
  { icon: "🌿", bottom: "4%", left: "45%", size: 46, delay: 1.1 },
  { icon: "🌷", top: "45%", left: "3%", size: 40, delay: 0.8 },
  { icon: "🌸", top: "42%", right: "2%", size: 42, delay: 1.0 },
  { icon: "🌹", top: "2%", left: "42%", size: 48, delay: 0.3 },
];

export function Welcome({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        size: 6 + Math.random() * 8,
      })),
    [],
  );

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="welcome"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "var(--gradient-petal)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Warm glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(600px 600px at 50% 50%, color-mix(in oklab, #F7A8B8 30%, transparent), transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />

          {/* Sparkles */}
          {sparkles.map((s) => (
            <span
              key={s.id}
              aria-hidden
              className="absolute rounded-full"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)",
                animation: `sparkle 2.6s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}

          {/* Floral frame */}
          {FRAME_FLOWERS.map((f, i) => (
            <motion.span
              key={i}
              className="absolute select-none"
              style={{
                top: f.top,
                left: f.left,
                right: f.right,
                bottom: f.bottom,
                fontSize: f.size,
                filter: "drop-shadow(0 8px 16px rgba(183,110,121,0.25))",
              }}
              initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1.4,
                delay: f.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.span
                style={{ display: "inline-block" }}
                animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {f.icon}
              </motion.span>
            </motion.span>
          ))}

          {/* Falling petals */}
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={`p-${i}`}
              aria-hidden
              className="absolute top-0 select-none"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: 14 + Math.random() * 18,
                opacity: 0.8,
                animation: `petal-fall ${8 + Math.random() * 8}s linear ${Math.random() * 4}s infinite`,
              }}
            >
              {["🌸", "🌷", "🍃"][i % 3]}
            </span>
          ))}

          {/* Center text */}
          <div className="relative z-10 px-6 text-center">
            <motion.h1
              className="font-display text-5xl leading-[1.05] text-charcoal md:text-7xl"
              style={{ color: "var(--charcoal)" }}
              initial={{ opacity: 0, y: 20, letterSpacing: "0.4em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
              transition={{ duration: 1.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              Welcome to <span className="text-rose-gold italic">Tulip Flo</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-base md:text-lg"
              style={{ color: "color-mix(in oklab, var(--charcoal) 75%, transparent)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 2.2 }}
            >
              Handmade Bouquets Crafted With Love 💐
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
