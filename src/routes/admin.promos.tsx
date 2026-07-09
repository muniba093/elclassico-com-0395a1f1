import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/promos")({
  component: AdminPromos,
});

type PromoType = "flat" | "percent" | "free_delivery";
type Promo = {
  id: string; code: string; type: PromoType; value: number;
  min_order_amount: number; usage_limit: number | null; used_count: number; active: boolean;
};

function AdminPromos() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Promo[];
    },
  });

  const [form, setForm] = useState({ code: "", type: "flat" as PromoType, value: 100, min_order_amount: 0, usage_limit: "" });

  async function create() {
    const code = form.code.trim().toUpperCase();
    if (!code) return toast.error("Code required");
    const { error } = await supabase.from("promo_codes").insert({
      code, type: form.type, value: Number(form.value) || 0,
      min_order_amount: Number(form.min_order_amount) || 0,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Promo created");
    setForm({ code: "", type: "flat", value: 100, min_order_amount: 0, usage_limit: "" });
    qc.invalidateQueries({ queryKey: ["admin-promos"] });
  }

  async function toggle(p: Promo) {
    const { error } = await supabase.from("promo_codes").update({ active: !p.active }).eq("id", p.id);
    if (error) toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-promos"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this promo code?")) return;
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-promos"] });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">Create promo code</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          <input placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm uppercase" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PromoType })}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="flat">Flat (Rs. off)</option>
            <option value="percent">Percent (% off)</option>
            <option value="free_delivery">Free delivery</option>
          </select>
          <input type="number" placeholder="Value" value={form.value}
            disabled={form.type === "free_delivery"}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm disabled:opacity-50" />
          <input type="number" placeholder="Min order" value={form.min_order_amount}
            onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          <input type="number" placeholder="Usage limit (blank = ∞)" value={form.usage_limit}
            onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <button onClick={create} className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2 text-sm">
          <Plus size={14} /> Add promo
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Value</th>
              <th className="text-left px-4 py-3">Min order</th>
              <th className="text-left px-4 py-3">Used</th>
              <th className="text-left px-4 py-3">Active</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {q.data?.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono font-semibold">{p.code}</td>
                <td className="px-4 py-3">{p.type}</td>
                <td className="px-4 py-3">{p.type === "free_delivery" ? "—" : p.type === "percent" ? `${p.value}%` : `Rs. ${p.value}`}</td>
                <td className="px-4 py-3">Rs. {p.min_order_amount}</td>
                <td className="px-4 py-3">{p.used_count}{p.usage_limit ? ` / ${p.usage_limit}` : ""}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(p)} className={`rounded-full px-3 py-1 text-xs ${p.active ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                    {p.active ? "Active" : "Off"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(p.id)} className="text-destructive hover:opacity-70"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {q.data?.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No promo codes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}