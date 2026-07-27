import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Welcome } from "@/components/Welcome";
import { Home } from "@/components/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tulip Flo — Handmade Bouquets Crafted With Love" },
      {
        name: "description",
        content:
          "Discover handcrafted flower bouquets at Tulip Flo. Roses, tulips, peonies and more — arranged by hand and delivered like a heartfelt gift.",
      },
      { property: "og:title", content: "Tulip Flo — Handmade Bouquets Crafted With Love" },
      {
        property: "og:description",
        content:
          "A luxury boutique of handmade bouquets. Explore romantic florals for every beautiful moment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <>
      {showWelcome && <Welcome onFinish={() => setShowWelcome(false)} />}
      <Home />
    </>
  );
}
