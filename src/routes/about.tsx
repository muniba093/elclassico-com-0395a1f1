import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import storefront from "@/assets/store-front.jpg";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Crunzify" },
      { name: "description", content: "Our story: a love for food, quality ingredients, and creating memorable moments for our community." },
      { property: "og:title", content: "About — Crunzify" },
      { property: "og:description", content: "Passion for food. Crafted with care." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { title: "Quality", text: "We choose ingredients we'd serve to family." },
  { title: "Freshness", text: "Made today, never yesterday." },
  { title: "Hospitality", text: "Warmth in every greeting, every plate." },
  { title: "Consistency", text: "The same care, every single visit." },
];

function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteNav />

      <section className="pt-40 pb-20">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Our Story</p>
            <h1 className="mt-3 font-display text-5xl sm:text-7xl leading-[1.02]">
              Passion for food. <em className="not-italic text-[color:var(--gold)]">Crafted</em> with care.
            </h1>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
            Crunzify started with a simple idea — that great food and great moments belong together. Every dish, every drink, every detail of our room is built around that belief.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <img
            src={storefront.url}
            alt="Crunzify storefront at night"
            loading="lazy"
            className="w-full h-[55vh] object-cover rounded-3xl shadow-lift"
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Our Mission</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            To deliver memorable dining experiences through exceptional food, beverages and service.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe a cafe should feel like a refuge — a place where the music is right, the light is warm, and the people behind the counter know your order. That's what we built.
          </p>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">What We Stand For</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Four values, every day.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="rounded-3xl bg-card border border-border p-7 shadow-soft hover:shadow-lift transition-all hover:-translate-y-1 duration-500">
                <span className="text-gold font-display text-sm tabular-nums">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Gallery</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">A look inside.</h2>
         </div>
      </section>

      <SiteFooter />
    </div>
  );
}