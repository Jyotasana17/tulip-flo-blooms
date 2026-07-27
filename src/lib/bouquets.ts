import roses from "@/assets/bq-roses.jpg";
import tulips from "@/assets/bq-tulips.jpg";
import sunflowers from "@/assets/bq-sunflowers.jpg";
import lavender from "@/assets/bq-lavender.jpg";
import peonies from "@/assets/bq-peonies.jpg";
import mini from "@/assets/bq-mini.jpg";

export type Bouquet = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  flowers: string[];
  occasion: string;
  categories: string[];
  tint: string; // background tint for swipe
};

export const bouquets: Bouquet[] = [
  {
    id: "eternal-blush",
    name: "Eternal Blush",
    description: "A tender embrace of pink and cream roses, wrapped in silk ivory.",
    price: 89,
    image: roses,
    flowers: ["Pink Rose", "Cream Rose", "Eucalyptus"],
    occasion: "Anniversary",
    categories: ["large", "roses", "anniversary", "premium"],
    tint: "#F9E7EA",
  },
  {
    id: "spring-whisper",
    name: "Spring Whisper",
    description: "Delicate tulips in blush and porcelain — the sound of a soft morning.",
    price: 62,
    image: tulips,
    flowers: ["Pink Tulip", "White Tulip"],
    occasion: "Just Because",
    categories: ["medium", "tulips", "birthday"],
    tint: "#FDEEEE",
  },
  {
    id: "sunlit-vow",
    name: "Sunlit Vow",
    description: "Golden sunflowers dancing with wildflowers — bottled sunshine.",
    price: 74,
    image: sunflowers,
    flowers: ["Sunflower", "Daisy", "Wildflower"],
    occasion: "Graduation",
    categories: ["large", "sunflower", "graduation"],
    tint: "#FBEAC5",
  },
  {
    id: "lilac-lullaby",
    name: "Lilac Lullaby",
    description: "Lavender and baby's breath — a poem for quiet, gentle moments.",
    price: 58,
    image: lavender,
    flowers: ["Lavender", "Baby's Breath", "Lilac"],
    occasion: "Baby Shower",
    categories: ["medium", "baby-shower", "premium"],
    tint: "#E9DDF7",
  },
  {
    id: "porcelain-promise",
    name: "Porcelain Promise",
    description: "Peonies and cream roses tied in blush ribbon — made for forever.",
    price: 128,
    image: peonies,
    flowers: ["Peony", "Cream Rose", "Ruscus"],
    occasion: "Wedding",
    categories: ["large", "wedding", "premium"],
    tint: "#F5EDE7",
  },
  {
    id: "petit-amour",
    name: "Petit Amour",
    description: "A little bouquet with a big heart — roses cradled in baby's breath.",
    price: 34,
    image: mini,
    flowers: ["Pink Rose", "Baby's Breath"],
    occasion: "Surprise",
    categories: ["mini", "roses", "surprise", "birthday"],
    tint: "#FBE5EA",
  },
];

export type Category = {
  slug: string;
  emoji: string;
  name: string;
  blurb: string;
  color: string;
};

export const categories: Category[] = [
  { slug: "large", emoji: "💐", name: "Large Bouquets", blurb: "Grand gestures", color: "#F9E7EA" },
  { slug: "medium", emoji: "🌷", name: "Medium Bouquets", blurb: "Just right", color: "#F4DDE1" },
  { slug: "mini", emoji: "🌼", name: "Mini Bouquets", blurb: "Little joys", color: "#FBEFD5" },
  { slug: "wedding", emoji: "💍", name: "Wedding", blurb: "Forever begins", color: "#F5EDE7" },
  { slug: "anniversary", emoji: "❤️", name: "Anniversary", blurb: "Still in love", color: "#F7C8CE" },
  { slug: "birthday", emoji: "🎂", name: "Birthday", blurb: "Make a wish", color: "#F9D6C8" },
  { slug: "graduation", emoji: "🎓", name: "Graduation", blurb: "You did it", color: "#FBEAC5" },
  { slug: "baby-shower", emoji: "👶", name: "Baby Shower", blurb: "Welcome, little one", color: "#DCE9DD" },
  { slug: "surprise", emoji: "🎁", name: "Surprise Gifts", blurb: "For no reason", color: "#EADDF5" },
  { slug: "sunflower", emoji: "🌻", name: "Sunflower Collection", blurb: "Pocket sunshine", color: "#FBEAC5" },
  { slug: "roses", emoji: "🌹", name: "Roses", blurb: "Timeless love", color: "#F9E0E3" },
  { slug: "tulips", emoji: "🌸", name: "Tulips", blurb: "Soft & elegant", color: "#F7DCE1" },
  { slug: "premium", emoji: "✨", name: "Premium Collection", blurb: "Handcrafted luxury", color: "#E9DDF7" },
];

export function bouquetsInCategory(slug: string): Bouquet[] {
  const inCat = bouquets.filter((b) => b.categories.includes(slug));
  return inCat.length > 0 ? inCat : bouquets;
}

export function findBouquet(id: string) {
  return bouquets.find((b) => b.id === id);
}
