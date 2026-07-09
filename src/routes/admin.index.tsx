import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/cart";
import { STATUS_LABEL, STATUS_OPTIONS, STATUS_TONE } from "@/lib/order-status";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminOrders,
});

function AdminOrders() {
  const qc = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const q = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("admin-orders-rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload: any) => {
        qc.invalidateQueries({ queryKey: ["admin-orders"] });
        toast.success(`New order from ${payload?.new?.customer_name ?? "customer"}!`);
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        } catch {}
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-orders"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Status updated");
  }

  const stats = (q.data ?? []).reduce(
    (a, o) => {
      a.total += 1;
      if (o.status === "pending") a.pending += 1;
      if (o.status !== "cancelled") a.revenue += Number(o.total);
      return a;
    },
    { total: 0, pending: 0, revenue: 0 },
  );

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: "none" }}
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_1a05131c14.mp3?filename=notification-sound-7062.mp3"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total Orders" value={String(stats.total)} />
        <Stat label="Pending" value={String(stats.pending)} />
        <Stat label="Revenue" value={formatPKR(stats.revenue)} />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {q.data?.map((o) => (
                <tr key={o.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-xs">{o.customer_address}</div>
                    {o.notes && <div className="text-xs italic mt-1">“{o.notes}”</div>}
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5 text-xs">
                      {o.order_items.map((i: any) => (
                        <li key={i.id}>{i.quantity}× {i.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPKR(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-2 ${STATUS_TONE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="block w-full rounded-lg border border-border bg-background px-2 py-1 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {q.data?.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}