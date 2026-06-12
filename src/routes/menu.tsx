import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import sandwich from "@/assets/wa-1781244115847.jpeg.asset.json";
import burger from "@/assets/double-classic-burger.jpg.asset.json";
import wrap from "@/assets/a2bd3bbd-dc18-4eef-a6d7-e990c9afdbca.jpeg.asset.json";
import pizza from "@/assets/img-20260612-wa0000.jpg.asset.json";
import cake from "@/assets/1652974718-cxvjhw.webp.asset.json";
import latte from "@/assets/wa-1781243720627.jpeg.asset.json";
import green from "@/assets/wa-1781243603218.jpeg.asset.json";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Elclassico" },
      { name: "description", content: "Explore our curated menu of fresh food and handcrafted beverages at Elclassico." },
      { property: "og:title", content: "Menu — Elclassico" },
      { property: "og:description", content: "Curated food & handcrafted beverages." },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

const food = {
  veg: [
    { name: "Grilled Veg Club", desc: "Toasted multigrain, garden veg, herbed mayo, golden fries.", img: sandwich.url },
    { name: "Margherita Pizza", desc: "Hand-stretched dough, San Marzano, mozzarella, basil.", img: pizza.url },
    { name: "Paneer Tikka Wrap", desc: "Charred paneer, mint chutney, crisp slaw in a soft flatbread.", img: wrap.url },
  ],
  nonVeg: [
    { name: "Double Classic Burger", desc: "Twin smashed patties, cheddar, pickles, secret sauce.", img: burger.url },
    { name: "Pepperoni Pizza", desc: "Slow-fermented crust, cured pepperoni, bubbling mozzarella.", img: pizza.url },
    { name: "Chicken Shawarma Wrap", desc: "Spiced chicken, garlic toum, pickles, golden fries.", img: wrap.url },
    { name: "Club Sandwich", desc: "Triple stack with chicken, egg, bacon, herbed mayo.", img: sandwich.url },
  ],
};

const beverages = [
  { name: "Signature Latte", desc: "House espresso, velvet steamed milk, fern art.", img: latte.url },
  { name: "Ultimate Green", desc: "Cold-pressed greens, apple, mint, ginger.", img: green.url },
  { name: "Iced Caramel Macchiato", desc: "Vanilla, milk, espresso, slow-poured caramel.", img: latte.url },
  { name: "Cortado", desc: "Equal parts espresso and warm milk. Bold, balanced.", img: latte.url },
];

const desserts = [
  { name: "Chocolate Indulgence", desc: "Rich ganache, hazelnut praline, dark chocolate shards.", img: cake.url },
];

type Cat = "food" | "beverages";

function MenuPage() {
  const [cat, setCat] = useState<Cat>("food");

  return (
    <div className="bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="pt-40 pb-12 bg-gradient-dark text-ivory">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">The Menu</p>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl text-ivory max-w-3xl leading-[1.05]">
            Crafted plates. Considered sips.
          </h1>
          <p className="mt-5 max-w-xl text-ivory/70">
            A seasonal selection of food and beverages, prepared fresh, served with care.
          </p>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-20 z-30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass rounded-full p-1.5 inline-flex shadow-soft mt-6">
            {(["food", "beverages"] as Cat[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium capitalize transition-all ${
                  cat === c
                    ? "bg-foreground text-background shadow-soft"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-20">
          {cat === "food" ? (
            <>
              <MenuGroup title="Vegetarian" subtitle="Garden-forward, deeply flavorful." items={food.veg} />
              <MenuGroup title="Non-Vegetarian" subtitle="Hearty plates, perfectly seared." items={food.nonVeg} />
              <MenuGroup title="Desserts" subtitle="Sweet endings, made in-house." items={desserts} />
            </>
          ) : (
            <MenuGroup title="Beverages" subtitle="From slow-poured espresso to cold-pressed greens." items={beverages} />
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function MenuGroup({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { name: string; desc: string; img: string }[];
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{subtitle}</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">{title}</h2>
        </div>
        <div className="hairline flex-1 mb-3 hidden sm:block" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <article
            key={it.name}
            className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-500"
          >
            <div className="aspect-[5/4] overflow-hidden">
              <img
                src={it.img}
                alt={it.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl">{it.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}