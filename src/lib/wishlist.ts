import { useEffect, useState, useCallback } from "react";

const KEY = "tulipflo:wishlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("tulipflo:wishlist-change"));
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const handler = () => setIds(read());
    window.addEventListener("tulipflo:wishlist-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("tulipflo:wishlist-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const next = read();
    const i = next.indexOf(id);
    if (i >= 0) next.splice(i, 1);
    else next.push(id);
    write(next);
  }, []);

  const add = useCallback((id: string) => {
    const next = read();
    if (!next.includes(id)) {
      next.push(id);
      write(next);
    }
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x !== id));
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, add, remove, has };
}

// Deterministic rating from id for display
export function ratingFor(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 4.4 + (h % 60) / 100; // 4.40 - 4.99
}
