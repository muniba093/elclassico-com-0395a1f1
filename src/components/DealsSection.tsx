import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Timer, Tag } from "lucide-react";
import { useActiveDeals, discountedPrice, type Deal } from "@/lib/deals";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

function useCountdown(target: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (!target) return null;
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return { expired: true, label: "Deal Expired" };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { expired: false, label: d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}` };
}

function DealCard({ deal }: { deal: Deal }) {
  const countdown = useCountdown(deal.valid_till);
  const cart = useCart();
  const navigate = useNavigate();
  const price = discountedPrice(deal);
  const expired = countdown?.expired ?? false;

  function order() {
    cart.add({ id: `deal-${deal.id}`, name: deal.title, price, image_url: deal.image_url || null });
    toast.success("Added to cart");
    navigate({ to: "/cart" });
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {deal.image_url ? (
          <img src={deal.image_url} alt={deal.title} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
        ) : null}
        <span className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal-deep">
          {Math.round(Number(deal.discount_percent))}% Off
        </span>
        {deal.featured && (
          <span className="absolute right-4 top-4 rounded-full glass-dark px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ivory">
            Limited Time Offer
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl">{deal.title}</h3>
        {deal.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{deal.description}</p>
        )}

        <div className="mt-5 flex flex-wrap items-baseline gap-3">
          <span className="font-display text-3xl">Rs. {price}</span>
          <span className="text-sm text-muted-foreground line-through">Rs. {Math.round(Number(deal.original_price))}</span>
        </div>

        {deal.valid_till && (
          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-xs text-muted-foreground">
            <Timer size={14} className="shrink-0 text-gold" />
            <span className="min-w-0 truncate">
              {expired ? "Deal Expired" : <>Ends in <span className="font-medium tabular-nums text-foreground">{countdown?.label}</span> · Valid till {new Date(deal.valid_till).toLocaleDateString()}</>}
            </span>
          </div>
        )}

        <button
          onClick={order}
          disabled={expired}
          className="mt-6 w-full rounded-full bg-gradient-gold px-6 py-3 text-sm font-medium text-charcoal-deep shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {expired ? "Deal Expired" : "Order Now"}
        </button>
      </div>
    </article>
  );
}

export function DealsSection() {
  const { data } = useActiveDeals();
  const deals = data ?? [];
  if (!deals.length) return null;

  return (
    <section id="deals" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
            <Tag size={14} /> Deals &amp; Discounts
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Save more, taste more.</h2>
          <p className="mt-3 text-muted-foreground">Limited-time offers on our most loved plates.</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      </div>
    </section>
  );
}