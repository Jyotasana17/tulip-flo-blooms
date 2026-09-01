import { useMemo } from "react";
import { motion } from "motion/react";

const PIECES = ["🌸", "🌷", "🌹", "🌼", "🍃", "✨", "💗"];

export function PetalConfetti({ count = 60, duration = 6 }: { count?: number; duration?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        fall: duration * (0.6 + Math.random() * 0.6),
        drift: (Math.random() - 0.5) * 260,
        spin: (Math.random() - 0.5) * 900,
        size: 14 + Math.random() * 24,
        icon: PIECES[Math.floor(Math.random() * PIECES.length)],
      })),
    [count, duration],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          style={{ left: `${p.left}%`, top: "-8vh", fontSize: p.size }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: "112vh", x: p.drift, rotate: p.spin, opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.fall, delay: p.delay, ease: "easeIn", times: [0, 0.1, 0.8, 1] }}
        >
          {p.icon}
        </motion.span>
      ))}
    </div>
  );
}
