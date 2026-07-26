import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPKR } from "@/lib/cart";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/order-status";

export const Route = createFileRoute("/my-orders")({
  head: () => ({ meta: [{ title: "My Orders — Elclassico" }] }),
  component: MyOrders,
});

function MyOrders() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const q = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display text-4xl sm:text-5xl">My Orders</h1>
            <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="text-sm text-muted-foreground hover:text-foreground">
              Sign out
            </button>
          </div>

          {q.isLoading ? (
            <p className="mt-8 text-muted-foreground">Loading…</p>
          ) : !q.data?.length ? (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">No orders yet.</p>
              <Link to="/menu" className="mt-4 inline-flex rounded-full bg-foreground text-background px-6 py-3 text-sm">Order now</Link>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {q.data.map((o) => (
                <article key={o.id} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Order #{o.id.slice(0, 8)}</p>
                      <p className="font-display text-xl mt-1">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`self-start rounded-full px-3 py-1 text-xs font-medium ${STATUS_TONE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-1 text-sm">
                    {o.order_items.map((i: any) => (
                      <li key={i.id} className="flex justify-between">
                        <span>{i.name} × {i.quantity}</span>
                        <span className="text-muted-foreground">{formatPKR(Number(i.price) * i.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                    <span className="text-muted-foreground">Total (incl. delivery)</span>
                    <span className="font-display text-lg">{formatPKR(Number(o.total))}</span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link to="/order/$id" params={{ id: o.id }} className="text-sm underline text-muted-foreground hover:text-foreground">
                      Track order →
                    </Link>
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