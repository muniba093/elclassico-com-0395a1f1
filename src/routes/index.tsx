import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Leaf, Coffee, Sparkles, HeartHandshake, Star, ArrowRight, MapPin, Instagram } from "lucide-react";
import hero from "@/assets/hero-ambiance.jpg";
import latte from "@/assets/latte.webp"; 
import green from "@/assets/wa-1781243603218.jpeg.asset.json";
import sandwich from "@/assets/wa-1781244115847.jpeg.asset.json";
import burger from "@/assets/double-classic-burger.jpg.asset.json";
import wrap from "@/assets/a2bd3bbd-dc18-4eef-a6d7-e990c9afdbca.jpeg.asset.json";
import cake from "@/assets/1652974718-cxvjhw.webp.asset.json";
import pizzaAsset from "@/assets/img-20260612-wa0000.jpg.asset.json";
import storefront from "@/assets/fb-img-1781243476949.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crunzify — Where Great Food Meets Great Moments" },
      { name: "description", content: "A premium cafe serving handcrafted beverages, fresh food and a warm, welcoming atmosphere designed for memorable moments." },
      { property: "og:title", content: "Crunzify — Premium Cafe" },
      { property: "og:description", content: "Handcrafted beverages, fresh food, cozy ambience." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CafeOrCoffeeShop",
          name: "Crunzify",
          servesCuisine: ["Cafe", "Coffee", "Sandwiches", "Burgers"],
          priceRange: "$$",
          url: "/",
        }),
      },
    ],
  }),
  component: HomePage,
});

const highlights = [
  { icon: Leaf, title: "Fresh Ingredients", desc: "Sourced daily from trusted local growers." },
  { icon: Coffee, title: "Handcrafted Beverages", desc: "Single-origin beans, poured with patience." },
  { icon: Sparkles, title: "Cozy Atmosphere", desc: "Warm light, soft music, comfortable seats." },
  { icon: HeartHandshake, title: "Exceptional Service", desc: "Hospitality that feels effortless." },
];

const picks = [
  { img: latte.url, name: "Signature Latte", tag: "House Blend" },
  { img: green.url, name: "Ultimate Green", tag: "Cold Pressed" },
  { img: sandwich.url, name: "Classic Club", tag: "Bestseller" },
  { img: burger.url, name: "Double Classic Burger", tag: "Crowd Favourite" },
  { img: wrap.url, name: "Spicy Wrap", tag: "Chef's Pick" },
  { img: cake.url, name: "Chocolate Indulgence", tag: "Patisserie" },
];

const why = [
  "Quality Ingredients",
  "Consistent Taste",
  "Comfortable Ambience",
  "Friendly Service",
  "Memorable Dining Experience",
];

const reviews = [
  { name: "Aisha R.", text: "The latte is a ritual. Every sip feels intentional, every visit feels like home." },
  { name: "Daniel M.", text: "The Double Classic Burger ruined every other burger for me. Beautifully presented." },
  { name: "Sara K.", text: "Easily the most stylish cafe in the city — and the food lives up to the room." },
];

function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={hero}
          alt="Crunzify cafe interior"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover scale-105 animate-float"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/70 via-charcoal-deep/45 to-charcoal-deep/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,oklch(0.11_0.008_60/0.85))]" />

        <div className="relative z-10 flex min-h-[100svh] items-center">
          <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 w-full">
            <p className="reveal text-xs uppercase tracking-[0.4em] text-gold mb-6" style={{ animationDelay: "0.1s" }}>
              Est. 2022 — Premium Cafe
            </p>
            <h1
              className="reveal font-display text-ivory text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl"
              style={{ animationDelay: "0.25s" }}
            >
              Where Great Food <em className="not-italic text-gold">Meets</em> Great Moments
            </h1>
            <p
              className="reveal mt-6 max-w-xl text-ivory/75 text-base sm:text-lg leading-relaxed"
              style={{ animationDelay: "0.45s" }}
            >
              Experience exceptional flavors, handcrafted beverages, and a welcoming atmosphere designed for memorable moments.
            </p>
            <div
              className="reveal mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: "0.65s" }}
            >
              <Link
                to="/menu"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-4 text-sm font-medium text-charcoal-deep shadow-gold transition-all hover:-translate-y-0.5"
              >
                Explore Menu
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/visit"
                className="inline-flex items-center gap-2 rounded-full glass-dark px-7 py-4 text-sm font-medium text-ivory hover:bg-ivory/10 transition-colors"
              >
                Visit Us
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/50 text-[10px] uppercase tracking-[0.4em]">
          Scroll
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">The Crunzify Standard</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Crafted in every detail.</h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => (
              <div
                key={h.title}
                className="group relative rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-gold flex items-center justify-center text-charcoal-deep shadow-soft">
                  <h.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-2xl">{h.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PICKS */}
      <section className="py-24 sm:py-32 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Popular Picks</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Loved by regulars.</h2>
            </div>
            <Link to="/menu" className="text-sm font-medium underline-offset-4 hover:underline">
              See full menu →
            </Link>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((p) => (
              <article
                key={p.name}
                className="group relative overflow-hidden rounded-3xl shadow-soft bg-card"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/85 via-charcoal-deep/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.tag}</p>
                  <h3 className="mt-1 font-display text-2xl text-ivory">{p.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={pizzaAsset.url}
              alt="Wood-fired pizza"
              loading="lazy"
              className="rounded-3xl object-cover w-full aspect-[4/5] shadow-lift"
            />
            <div className="absolute -bottom-6 -right-6 glass rounded-2xl px-5 py-4 shadow-soft hidden sm:block">
              <p className="text-3xl font-display">★ 4.9</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">500+ Reviews</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Why Choose Us</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">A standard you can taste.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
              Every plate, every cup, every moment — built around one promise: quality you can rely on.
            </p>
            <ul className="mt-8 space-y-4">
              {why.map((w, i) => (
                <li key={w} className="flex items-start gap-4 border-t border-border pt-4">
                  <span className="text-gold font-display text-sm tabular-nums">0{i + 1}</span>
                  <span className="font-display text-xl">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 sm:py-32 bg-gradient-dark text-ivory">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-ivory">Loved by hundreds.</h2>
            <p className="mt-3 text-ivory/60">Honest words from our community.</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <blockquote
                key={r.name}
                className="glass-dark rounded-3xl p-8 transition-transform hover:-translate-y-1 duration-500"
              >
                <p className="font-display text-xl leading-relaxed text-ivory">“{r.text}”</p>
                <footer className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-ivory/70">— {r.name}</span>
                  <span className="text-gold text-xs tracking-[0.3em] uppercase">Guest</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">@crunzify</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Follow our journey.</h2>
              <p className="mt-3 text-muted-foreground max-w-md">Stay connected and discover our latest creations.</p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              <Instagram size={16} /> Follow on Instagram
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[latte.url, green.url, sandwich.url, burger.url, wrap.url, cake.url].map((src, i) => (
              <a
                key={i}
                href="#"
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <img src={src} loading="lazy" alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-charcoal-deep/0 group-hover:bg-charcoal-deep/40 transition-colors flex items-center justify-center">
                  <Instagram size={20} className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div
            className="relative overflow-hidden rounded-[2rem] p-10 sm:p-16 text-center"
            style={{ backgroundImage: `linear-gradient(180deg, oklch(0.18 0.012 60 / 0.78), oklch(0.11 0.008 60 / 0.92)), url(${storefront.url})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <h2 className="font-display text-4xl sm:text-6xl text-ivory max-w-3xl mx-auto">
              Ready for your next favorite meal?
            </h2>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/menu" className="rounded-full bg-gradient-gold px-7 py-4 text-sm font-medium text-charcoal-deep shadow-gold hover:-translate-y-0.5 transition-transform">View Menu</Link>
              <Link to="/visit" className="inline-flex items-center gap-2 rounded-full glass-dark px-7 py-4 text-sm font-medium text-ivory hover:bg-ivory/10 transition-colors">
                <MapPin size={16} /> Get Directions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
