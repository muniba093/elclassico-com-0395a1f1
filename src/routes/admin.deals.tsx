import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { discountedPrice, isExpired, type Deal } from "@/lib/deals";
import { toast } from "sonner";
import { Trash2, Plus, Star, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/admin/deals")({
  component: AdminDeals,
});

type FormState = {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discount_percent: number;
  valid_till: string;
  featured: boolean;
  sort_order: number;
};

const empty: FormState = {
  title: "", description: "", image_url: "", original_price: 0,
  discount_percent: 0, valid_till: "", featured: false, sort_order: 0,
};

const toInput = (v: string | null) => (v ? new Date(v).toISOString().slice(0, 16) : "");

function AdminDeals() {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);

  const q = useQuery({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals").select("*")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Deal[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-deals"] });
    qc.invalidateQueries({ queryKey: ["deals", "active"] });
  };

  async function save() {
    if (!form.title.trim()) return toast.error("Title required");
    const payload = {
      title: form.title.trim(),
      description: form.description,
      image_url: form.image_url,
      original_price: Number(form.original_price) || 0,
      discount_percent: Number(form.discount_percent) || 0,
      valid_till: form.valid_till ? new Date(form.valid_till).toISOString() : null,
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } = form.id
      ? await supabase.from("deals").update(payload).eq("id", form.id)
      : await supabase.from("deals").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Deal updated" : "Deal created");
    setForm(empty);
    refresh();
  }

  async function patch(d: Deal, values: Partial<Deal>) {
    const { error } = await supabase.from("deals").update(values).eq("id", d.id);
    if (error) toast.error(error.message);
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this deal?")) return;
    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) toast.error(error.message);
    refresh();
  }

  const input = "rounded-xl border border-border bg-background px-3 py-2 text-sm";

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="min-w-0 truncate font-display text-xl">{form.id ? "Edit deal" : "Create deal"}</h2>
          {form.id && (
            <button onClick={() => setForm(empty)} className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <X size={14} /> Cancel
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <input placeholder="Deal title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} className={`${input} w-full`} />
            <textarea placeholder="Description" rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${input} w-full`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted-foreground">Original price (Rs.)
                <input type="number" value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })} className={`${input} mt-1 w-full`} />
              </label>
              <label className="text-xs text-muted-foreground">Discount %
                <input type="number" value={form.discount_percent}
                  onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} className={`${input} mt-1 w-full`} />
              </label>
              <label className="text-xs text-muted-foreground">Valid till
                <input type="datetime-local" value={form.valid_till}
                  onChange={(e) => setForm({ ...form, valid_till: e.target.value })} className={`${input} mt-1 w-full`} />
              </label>
              <label className="text-xs text-muted-foreground">Sort order
                <input type="number" value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={`${input} mt-1 w-full`} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured (shows first, with “Limited Time Offer” badge)
            </label>
            <p className="text-sm text-muted-foreground">
              Discounted price: <span className="font-semibold text-foreground">Rs. {discountedPrice(form)}</span>
            </p>
          </div>

          <ImagePicker label="Deal image" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
        </div>

        <button onClick={save} className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm text-background">
          <Plus size={14} /> {form.id ? "Save changes" : "Add deal"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {q.data?.map((d) => {
          const expired = isExpired(d);
          return (
            <div key={d.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              {d.image_url && <img src={d.image_url} alt={d.title} className="aspect-[4/3] w-full object-cover" />}
              <div className="space-y-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <h3 className="min-w-0 truncate font-display text-lg">{d.title}</h3>
                  {d.featured && <Star size={14} className="shrink-0 text-gold" fill="currentColor" />}
                </div>
                <p className="text-sm">
                  <span className="font-semibold">Rs. {discountedPrice(d)}</span>{" "}
                  <span className="text-muted-foreground line-through">Rs. {Math.round(Number(d.original_price))}</span>{" "}
                  <span className="text-gold">({Math.round(Number(d.discount_percent))}%)</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {d.valid_till ? (expired ? "Expired" : `Valid till ${new Date(d.valid_till).toLocaleString()}`) : "No expiry"}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button onClick={() => patch(d, { active: !d.active })}
                    className={`rounded-full px-3 py-1 text-xs ${d.active ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                    {d.active ? "Enabled" : "Disabled"}
                  </button>
                  <button onClick={() => patch(d, { featured: !d.featured })}
                    className={`rounded-full px-3 py-1 text-xs ${d.featured ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"}`}>
                    Featured
                  </button>
                  <button onClick={() => setForm({
                    id: d.id, title: d.title, description: d.description, image_url: d.image_url,
                    original_price: Number(d.original_price), discount_percent: Number(d.discount_percent),
                    valid_till: toInput(d.valid_till), featured: d.featured, sort_order: d.sort_order,
                  })} className="rounded-full bg-muted px-3 py-1 text-xs inline-flex items-center gap-1">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => remove(d.id)} className="text-destructive hover:opacity-70"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {q.data?.length === 0 && <p className="text-muted-foreground">No deals yet.</p>}
      </div>
    </div>
  );
}