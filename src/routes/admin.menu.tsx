import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/cart";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/admin/menu")({
  component: AdminMenu,
});

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  available: boolean;
  popular: boolean;
};

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  price: z.number().min(0).max(100000),
  image_url: z.string().trim().url().max(500).or(z.literal("")),
  category_id: z.string().uuid().nullable(),
  available: z.boolean(),
  popular: z.boolean(),
});

function AdminMenu() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Item> | null>(null);

  const catsQ = useQuery({
    queryKey: ["admin-cats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const itemsQ = useQuery({
    queryKey: ["admin-menu"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").order("name");
      if (error) throw error;
      return data as Item[];
    },
  });

  async function save(form: Partial<Item>) {
    const parsed = schema.safeParse({
      name: form.name ?? "",
      description: form.description ?? "",
      price: Number(form.price ?? 0),
      image_url: form.image_url ?? "",
      category_id: form.category_id ?? null,
      available: form.available ?? true,
      popular: form.popular ?? false,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    const payload = { ...parsed.data, image_url: parsed.data.image_url || null };
    if (form.id) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", form.id);
      if (error) return toast.error(error.message);
      toast.success("Item updated");
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Item added");
    }
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-menu"] });
    qc.invalidateQueries({ queryKey: ["menu_items"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-menu"] });
    qc.invalidateQueries({ queryKey: ["menu_items"] });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{itemsQ.data?.length ?? 0} items</p>
        <button
          onClick={() => setEditing({ available: true, popular: false })}
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {itemsQ.data?.map((it) => (
          <div key={it.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            {it.image_url && <img src={it.image_url} alt={it.name} className="h-40 w-full object-cover" />}
            <div className="p-4">
              <div className="flex justify-between gap-2">
                <h3 className="font-display text-lg">{it.name}</h3>
                <span className="text-sm font-medium">{formatPKR(Number(it.price))}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{it.description}</p>
              <div className="mt-2 flex gap-2 text-[10px] uppercase tracking-wider">
                {it.popular && <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full">Popular</span>}
                {!it.available && <span className="bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Hidden</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(it)} className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs hover:bg-muted">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => remove(it.id)} className="inline-flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 px-3 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ItemModal
          item={editing}
          categories={catsQ.data ?? []}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function ItemModal({
  item, categories, onClose, onSave,
}: { item: Partial<Item>; categories: any[]; onClose: () => void; onSave: (i: Partial<Item>) => void }) {
  const [form, setForm] = useState<Partial<Item>>(item);
  return (
    <div className="fixed inset-0 z-50 bg-charcoal-deep/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border max-w-lg w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h2 className="font-display text-xl">{item.id ? "Edit Item" : "New Item"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-5 space-y-3">
          <Field label="Name" value={form.name ?? ""} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Description" value={form.description ?? ""} onChange={(v) => setForm({ ...form, description: v })} textarea />
          <Field label="Price (PKR)" value={String(form.price ?? "")} onChange={(v) => setForm({ ...form, price: Number(v) })} type="number" />
          <Field label="Image URL" value={form.image_url ?? ""} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://…" />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</label>
            <select
              value={form.category_id ?? ""}
              onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            >
              <option value="">— None —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
            Mark as Popular
          </label>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={() => onSave(form)} className="rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, textarea }: any) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
      )}
    </div>
  );
}