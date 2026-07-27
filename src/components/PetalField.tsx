import { useMemo } from "react";

const PETALS = ["🌸", "🌷", "🌹", "🌼", "🍃", "✨"];

export function PetalField({ count = 18, opacity = 0.75 }: { count?: number; opacity?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 10,
        size: 14 + Math.random() * 22,
        icon: PETALS[Math.floor(Math.random() * PETALS.length)],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 select-none"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            opacity,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
}
