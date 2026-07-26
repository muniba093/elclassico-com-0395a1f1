import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/cart";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/order-status";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Order Confirmation — Elclassico" }, { name: "robots", content: "noindex" }] }),
  component: OrderPage,
});

const STEPS = [
  { key: "pending", label: "Order placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

function OrderPage() {
  const { id } = useParams({ from: "/order/$id" });
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
    refetchInterval: 15000,
  });

  useEffect(() => {
    const ch = supabase
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, () => {
        qc.invalidateQueries({ queryKey: ["order", id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, qc]);

  const order = q.data;
  const cancelled = order?.status === "cancelled";
  const currentIdx = STEPS.findIndex((s) => s.key === order?.status);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          {q.isLoading ? (
            <p className="text-muted-foreground">Loading order…</p>
          ) : !order ? (
            <div className="text-center">
              <p className="text-muted-foreground">Order not found.</p>
              <Link to="/menu" className="mt-4 inline-block underline">Back to menu</Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 grid place-items-center">
                  <CheckCircle2 size={36} />
                </div>
                <h1 className="mt-5 font-display text-4xl sm:text-5xl">Thank you!</h1>
                <p className="mt-2 text-muted-foreground">Your order has been placed. We'll start preparing it right away.</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>

              <div className="mt-10 rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">Track your order</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_TONE[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>

                {cancelled ? (
                  <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    This order was cancelled. Please contact us if you have any questions.
                  </p>
                ) : (
                  <ol className="mt-6 space-y-4">
                    {STEPS.map((s, i) => {
                      const done = i < currentIdx;
                      const active = i === currentIdx;
                      return (
                        <li key={s.key} className="flex items-start gap-3">
                          <span className="mt-0.5">
                            {done ? (
                              <CheckCircle2 size={22} className="text-emerald-600" />
                            ) : active ? (
                              <Clock size={22} className="text-foreground animate-pulse" />
                            ) : (
                              <Circle size={22} className="text-muted-foreground/40" />
                            )}
                          </span>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${done || active ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                            {active && <p className="text-xs text-muted-foreground mt-0.5">In progress…</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
                <p className="mt-6 text-xs text-muted-foreground">This page updates automatically as your order progresses.</p>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-2xl">Order summary</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {order.order_items?.map((i: any) => (
                    <li key={i.id} className="flex justify-between">
                      <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                      <span>{formatPKR(Number(i.price) * i.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPKR(Number(order.subtotal))}</dd></div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-emerald-600"><dt>Discount{order.promo_code ? ` (${order.promo_code})` : ""}</dt><dd>−{formatPKR(Number(order.discount))}</dd></div>
                  )}
                  <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPKR(Number(order.delivery_fee))}</dd></div>
                  <div className="mt-2 border-t border-border pt-2 flex justify-between font-display text-xl"><dt>Total</dt><dd>{formatPKR(Number(order.total))}</dd></div>
                </dl>
                <div className="mt-6 grid gap-2 text-sm">
                  <p><span className="text-muted-foreground">Delivering to:</span> {order.customer_address}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</p>
                  <p><span className="text-muted-foreground">Payment:</span> {order.payment_method === "online" ? "Online Payment" : "Cash on Delivery"}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link to="/my-orders" className="rounded-full border border-border px-5 py-2.5 text-sm hover:bg-muted/40">All my orders</Link>
                <Link to="/menu" className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm">Order again</Link>
              </div>
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}