import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart, formatPKR } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Elclassico" },
      { name: "description", content: "Review your order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart();
  const navigate = useNavigate();
  const deliveryFee = subtotal > 0 ? 150 : 0;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="font-display text-4xl sm:text-5xl">Your Cart</h1>
          <p className="mt-2 text-muted-foreground">{count} item{count !== 1 ? "s" : ""}</p>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-card border border-border">
                <ShoppingBag size={24} className="text-muted-foreground" />
              </div>
              <p className="mt-6 text-lg">Your cart is empty.</p>
              <Link to="/menu" className="mt-6 inline-flex rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                    {it.image_url && (
                      <img src={it.image_url} alt={it.name} className="h-24 w-24 rounded-xl object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <h3 className="font-display text-xl">{it.name}</h3>
                        <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{formatPKR(it.price)} each</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button onClick={() => setQty(it.id, it.quantity - 1)} className="p-2" aria-label="Decrease">
                            <Minus size={14} />
                          </button>
                          <span className="px-3 min-w-[28px] text-center text-sm font-medium">{it.quantity}</span>
                          <button onClick={() => setQty(it.id, it.quantity + 1)} className="p-2" aria-label="Increase">
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-display text-lg">{formatPKR(it.price * it.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <aside className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-28">
                <h2 className="font-display text-2xl">Summary</h2>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPKR(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPKR(deliveryFee)}</dd></div>
                  <div className="border-t border-border pt-3 flex justify-between font-display text-xl"><dt>Total</dt><dd>{formatPKR(subtotal + deliveryFee)}</dd></div>
                </dl>
                <button
                  onClick={() => navigate({ to: "/checkout" })}
                  className="mt-6 w-full rounded-full bg-foreground text-background py-3 text-sm font-medium hover:-translate-y-0.5 transition-transform"
                >
                  Proceed to Checkout
                </button>
                <Link to="/menu" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
                  Continue shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}