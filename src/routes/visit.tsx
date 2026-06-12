import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, Phone, ShoppingBag, Bike, Clock, Instagram } from "lucide-react";
import latte from "@/assets/wa-1781243720627.jpeg.asset.json";
import green from "@/assets/wa-1781243603218.jpeg.asset.json";
import sandwich from "@/assets/wa-1781244115847.jpeg.asset.json";
import burger from "@/assets/double-classic-burger.jpg.asset.json";
import wrap from "@/assets/a2bd3bbd-dc18-4eef-a6d7-e990c9afdbca.jpeg.asset.json";
import cake from "@/assets/1652974718-cxvjhw.webp.asset.json";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Us — Elclassico" },
      { name: "description", content: "Find Elclassico — address, opening hours, contact, directions, pickup and delivery." },
      { property: "og:title", content: "Visit Elclassico" },
      { property: "og:description", content: "Come say hello — find us, call us, or order pickup & delivery." },
      { property: "og:url", content: "/visit" },
    ],
    links: [{ rel: "canonical", href: "/visit" }],
  }),
  component: VisitPage,
});

const hours = [
  { day: "Monday – Thursday", time: "8:00 AM – 11:00 PM" },
  { day: "Friday – Saturday", time: "8:00 AM – 1:00 AM" },
  { day: "Sunday", time: "9:00 AM – 11:00 PM" },
];

function VisitPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteNav />

      <section className="pt-40 pb-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Visit Us</p>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl">Visit Elclassico</h1>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            We'd love to host you. Drop in for a coffee, a quick bite, or a long, unhurried evening.
          </p>
        </div>
      </section>

      {/* Map + Address */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-3xl overflow-hidden shadow-lift border border-border h-[420px]">
            <iframe
              title="Elclassico location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1485%2C51.5034%2C-0.1245%2C51.5174&amp;layer=mapnik"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="lg:col-span-2 rounded-3xl bg-card border border-border p-8 shadow-soft flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Address</p>
              <p className="mt-2 font-display text-2xl">[Add cafe address here]</p>
            </div>
            <div className="hairline" />
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-sm"><Phone size={16} className="text-gold" /> [Add phone number]</p>
              <p className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-gold" /> hello@elclassico.com</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <ActionBtn icon={MapPin} label="Get Directions" />
              <ActionBtn icon={Phone} label="Call Now" />
              <ActionBtn icon={ShoppingBag} label="Order Pickup" />
              <ActionBtn icon={Bike} label="Order Delivery" />
            </div>
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Opening Hours</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Come on by.</h2>
            </div>
            <Clock size={28} className="text-gold" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {hours.map((h) => (
              <div key={h.day} className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-lift transition-all hover:-translate-y-1 duration-500">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{h.day}</p>
                <p className="mt-2 font-display text-2xl">{h.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">@elclassico</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Latest from the gram.</h2>
            </div>
            <a href="#" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:shadow-gold transition-shadow">
              <Instagram size={16} /> Follow Us
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[latte.url, green.url, sandwich.url, burger.url, wrap.url, cake.url].map((src, i) => (
              <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-2xl">
                <img src={src} loading="lazy" alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ActionBtn({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-xs font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-colors">
      <Icon size={14} /> {label}
    </button>
  );
}