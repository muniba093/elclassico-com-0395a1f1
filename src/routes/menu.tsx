import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Star } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatPKR } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Order Online | Elclassico" },
      { name: "description", content: "Order Pakistani BBQ, biryani, burgers, pizza, wraps and more online from Elclassico. Fast delivery." },
      { property: "og:title", content: "Menu — Order Online | Elclassico" },
      { property: "og:description", content: "Order Pakistani BBQ, biryani, burgers, pizza, wraps and more online." },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

type Category = { id: string; name: string; slug: string; sort_order: number };
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  popular: boolean;
  available: boolean;
};

type Sort = "price-asc" | "price-desc" | "name";

function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("name");
  const { add } = useCart();

  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const itemsQ = useQuery({
    queryKey: ["menu_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").eq("available", true);
       console.log("MENU DATA:", data);
    console.log("MENU ERROR:", error);

      
      if (error) throw error;
      return data as MenuItem[];
    },
  });

  const filtered = useMemo(() => {
    let list = itemsQ.data ?? [];
    if (activeCat !== "all") list = list.filter((i) => i.category_id === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-desc") sorted.sort((a, b) => Number(b.price) - Number(a.price));
    else sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [itemsQ.data, activeCat, search, sort]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />

      <section className="pt-36 pb-10 bg-gradient-dark text-ivory">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">The Menu</p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl text-ivory max-w-3xl leading-[1.05]">
            Order your favourites.
          </h1>
          <p className="mt-4 max-w-xl text-ivory/70">
            Fresh Pakistani BBQ, biryani, burgers and more — delivered hot to your door.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-20 z-30 bg-background/85 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes…"
                className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-foreground/40"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none"
            >
              <option value="name">Sort: Name A–Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <CatPill active={activeCat === "all"} onClick={() => setActiveCat("all")}>All</CatPill>
            {catsQ.data?.map((c) => (
              <CatPill key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
                {c.name}
              </CatPill>
            ))}
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {itemsQ.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-card border border-border h-80 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No items found.</p>
              <p className="text-sm mt-2">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((it) => (
                <article
                  key={it.id}
                  className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-500 flex flex-col"
                >
                  <div className="aspect-[5/4] overflow-hidden bg-muted relative">
                    {it.image_url ? (
                      <img
                        src={it.image_url}
                        alt={it.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-muted-foreground">No image</div>
                    )}
                    {it.popular && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-gold text-charcoal-deep text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1">
                        <Star size={10} fill="currentColor" /> Popular
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display text-2xl">{it.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">{it.description}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-display text-2xl text-foreground">{formatPKR(Number(it.price))}</span>
                      <button
                        onClick={() => {
                          add({ id: it.id, name: it.name, price: Number(it.price), image_url: it.image_url });
                          toast.success(`${it.name} added to cart`);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:-translate-y-0.5 transition-transform"
                      >
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function CatPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active ? "bg-foreground text-background" : "bg-card border border-border text-foreground/80 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}