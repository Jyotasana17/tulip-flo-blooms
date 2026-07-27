import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Home } from "lucide-react";

export function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌷</span>
            <span className="font-display text-2xl italic tracking-tight text-charcoal" style={{ color: "var(--charcoal)" }}>
              Tulip Flo
            </span>
          </Link>
          <div className="hidden flex-1 justify-center md:flex">
            <div className="glass-card flex w-full max-w-md items-center gap-2 rounded-full px-4 py-2">
              <Search size={16} className="opacity-60" />
              <input
                placeholder="Search bouquets, occasions, flowers…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--muted-foreground)]"
              />
            </div>
          </div>
          <nav className="flex items-center gap-1 md:gap-3">
            <IconBtn label="Wishlist"><Heart size={18} /></IconBtn>
            <IconBtn label="Cart"><ShoppingBag size={18} /></IconBtn>
            <IconBtn label="Profile"><User size={18} /></IconBtn>
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full px-2 py-2 md:hidden glass-card">
        <MobileBtn label="Home"><Home size={18} /></MobileBtn>
        <MobileBtn label="Wishlist"><Heart size={18} /></MobileBtn>
        <MobileBtn label="Cart"><ShoppingBag size={18} /></MobileBtn>
        <MobileBtn label="Profile"><User size={18} /></MobileBtn>
      </nav>
    </>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full transition hover:-translate-y-0.5 hover:bg-white/70"
      style={{ color: "var(--charcoal)" }}
    >
      {children}
    </button>
  );
}

function MobileBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="flex flex-col items-center gap-0.5 rounded-full px-4 py-2 text-[10px] transition active:scale-95"
      style={{ color: "var(--charcoal)" }}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
