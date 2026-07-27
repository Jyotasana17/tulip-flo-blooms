import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";

// Bouquets emerging from all sides — organic spread, center-safe.
// Each entry: position, size, delay, rotation, blur (depth), emoji cluster.
const BOUQUETS = [
  // Top row
  { emoji: "💐", top: "-3%", left: "12%", size: 90, delay: 1.9, rot: -14, blur: 0.6, from: "top" },
  { emoji: "🌹", top: "-4%", left: "38%", size: 76, delay: 2.4, rot: 8, blur: 1.2, from: "top" },
  { emoji: "🌷", top: "-2%", left: "62%", size: 84, delay: 2.1, rot: -6, blur: 0 },
  { emoji: "🌻", top: "-4%", left: "84%", size: 78, delay: 2.6, rot: 12, blur: 1.4 },
  // Left column
  { emoji: "🌼", top: "22%", left: "-3%", size: 96, delay: 2.0, rot: -18, blur: 0 },
  { emoji: "💜", top: "48%", left: "-4%", size: 82, delay: 2.8, rot: 14, blur: 1 },
  { emoji: "🤍", top: "72%", left: "3%", size: 70, delay: 3.2, rot: -10, blur: 1.5 },
  // Right column
  { emoji: "🌸", top: "18%", left: "88%", size: 92, delay: 2.3, rot: 16, blur: 0 },
  { emoji: "🎀", top: "44%", left: "92%", size: 74, delay: 3.0, rot: -12, blur: 1.3 },
  { emoji: "💐", top: "70%", left: "86%", size: 88, delay: 2.7, rot: 6, blur: 0.4 },
  // Bottom row
  { emoji: "🌷", top: "92%", left: "16%", size: 96, delay: 3.1, rot: 10, blur: 0 },
  { emoji: "🌹", top: "94%", left: "42%", size: 80, delay: 2.9, rot: -14, blur: 1.1 },
  { emoji: "🌼", top: "93%", left: "68%", size: 86, delay: 3.3, rot: 4, blur: 0.6 },
  { emoji: "🌻", top: "92%", left: "90%", size: 72, delay: 3.5, rot: -8, blur: 1.4 },
  // Corner accents
  { emoji: "🍃", top: "8%", left: "4%", size: 44, delay: 3.4, rot: -20, blur: 0 },
  { emoji: "🌿", top: "10%", left: "94%", size: 42, delay: 3.6, rot: 20, blur: 0.5 },
  { emoji: "🌿", top: "86%", left: "6%", size: 46, delay: 3.7, rot: 12, blur: 0.8 },
  { emoji: "🍃", top: "84%", left: "94%", size: 40, delay: 3.8, rot: -18, blur: 0.5 },
  // A couple behind the title (blurred, big)
  { emoji: "💐", top: "36%", left: "28%", size: 110, delay: 2.5, rot: -8, blur: 2.5 },
  { emoji: "🌸", top: "56%", left: "70%", size: 100, delay: 2.7, rot: 10, blur: 2.5 },
] as const;

function fromOffset(from: string | undefined, top: string, left: string) {
  // Determine which edge the bouquet enters from based on its position.
  const t = parseFloat(top);
  const l = parseFloat(left);
  if (from === "top" || t < 15) return { x: 0, y: -140 };
  if (t > 85) return { x: 0, y: 140 };
  if (l < 15) return { x: -160, y: 0 };
  if (l > 85) return { x: 160, y: 0 };
  return { x: 0, y: -60 };
}

export function Welcome({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5200);
    return () => clearTimeout(t);
  }, []);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        size: 4 + Math.random() * 10,
      })),
    [],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 18,
        delay: 0.8 + Math.random() * 4,
        duration: 8 + Math.random() * 8,
        icon: ["🌸", "🌷", "🍃", "🌹"][i % 4],
      })),
    [],
  );

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="welcome"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #FFFDF9 0%, #FDEFF1 45%, #F7E2E7 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fade-from-white overlay (0-1s) */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          />

          {/* Warm ambient glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(700px 700px at 50% 45%, rgba(247,168,184,0.35), transparent 65%), radial-gradient(600px 600px at 20% 80%, rgba(233,221,247,0.35), transparent 65%), radial-gradient(500px 500px at 85% 20%, rgba(255,232,180,0.30), transparent 65%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.4 }}
          />

          {/* Subtle floral texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #b76e79 1px, transparent 2px), radial-gradient(circle at 70% 60%, #b76e79 1px, transparent 2px), radial-gradient(circle at 40% 80%, #b76e79 1px, transparent 2px)",
              backgroundSize: "120px 120px, 160px 160px, 90px 90px",
            }}
          />

          {/* Light particles */}
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
                animation: `sparkle 2.8s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}

          {/* Falling petals (start ~1s) */}
          {petals.map((p) => (
            <span
              key={p.id}
              aria-hidden
              className="absolute top-0 select-none"
              style={{
                left: `${p.left}%`,
                fontSize: p.size,
                opacity: 0.75,
                animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
              }}
            >
              {p.icon}
            </span>
          ))}

          {/* Bouquets emerging from all sides (2-5s) */}
          {BOUQUETS.map((b, i) => {
            const off = fromOffset((b as any).from, b.top, b.left);
            return (
              <motion.div
                key={i}
                className="pointer-events-none absolute select-none"
                style={{
                  top: b.top,
                  left: b.left,
                  fontSize: b.size,
                  filter: `drop-shadow(0 14px 22px rgba(183,110,121,0.35)) blur(${b.blur}px)`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{
                  opacity: 0,
                  x: off.x,
                  y: off.y,
                  scale: 0.3,
                  rotate: b.rot * 2,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: b.rot,
                }}
                transition={{
                  duration: 1.4,
                  delay: b.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.span
                  style={{ display: "inline-block" }}
                  animate={{ y: [0, -8, 0], rotate: [b.rot, b.rot + 3, b.rot] }}
                  transition={{
                    duration: 5 + (i % 5),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: b.delay + 1.2,
                  }}
                >
                  {b.emoji}
                </motion.span>
              </motion.div>
            );
          })}

          {/* Center title */}
          <div className="relative z-10 px-6 text-center">
            <motion.h1
              className="font-display text-5xl leading-[1.02] md:text-8xl"
              style={{
                background:
                  "linear-gradient(135deg, #c9a86b 0%, #e8c88d 30%, #b48a4a 60%, #d9b57a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 6px 24px rgba(201,168,107,0.35))",
              }}
              initial={{ opacity: 0, y: 24, letterSpacing: "0.4em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
              transition={{ duration: 1.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Welcome to
              <br />
              <span className="italic">Tulip Flo</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-sm md:text-base"
              style={{ color: "color-mix(in oklab, #3E3E3E 70%, transparent)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.4 }}
            >
              Handcrafted Bouquets Made with Love
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
