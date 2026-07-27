import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SwipeDeck } from "@/components/SwipeDeck";
import { bouquetsInCategory, categories } from "@/lib/bouquets";

export const Route = createFileRoute("/browse/$category")({
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.category);
    const name = cat?.name ?? "Bouquets";
    return {
      meta: [
        { title: `${name} — Tulip Flo` },
        {
          name: "description",
          content: `Swipe through our ${name.toLowerCase()} — handcrafted bouquets ready to be discovered.`,
        },
        { property: "og:title", content: `${name} — Tulip Flo` },
        {
          property: "og:description",
          content: `Handmade ${name.toLowerCase()} at Tulip Flo. Swipe to save your favorites.`,
        },
      ],
    };
  },
  component: BrowseCategory,
});

function BrowseCategory() {
  const { category } = useParams({ from: "/browse/$category" });
  const items = bouquetsInCategory(category);
  const cat = categories.find((c) => c.slug === category);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-4 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm glass-card"
            style={{ color: "var(--charcoal)" }}
          >
            <ArrowLeft size={16} /> Back home
          </Link>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.3em] opacity-60">Category</div>
            <div className="font-display text-2xl md:text-3xl">
              {cat?.emoji} {cat?.name ?? "All bouquets"}
            </div>
          </div>
        </div>
        <SwipeDeck bouquets={items} />
      </main>
    </div>
  );
}
