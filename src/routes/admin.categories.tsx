import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const qc = useQueryClient();
  const [name, setName] = useState("");

  const q = useQuery({
    queryKey: ["admin-cats-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  async function add() {
    const n = name.trim();
    if (!n) return;
    const slug = n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sort_order = (q.data?.length ?? 0) + 1;
    const { error } = await supabase.from("categories").insert({ name: n, slug, sort_order });
    if (error) return toast.error(error.message);
    setName("");
    toast.success("Category added");
    qc.invalidateQueries({ queryKey: ["admin-cats-list"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Items will become uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-cats-list"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  }

  return (
    <div className="max-w-xl">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New category name…"
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm"
        />
        <button onClick={add} className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium">
          <Plus size={16} /> Add
        </button>
      </div>
      <ul className="mt-6 space-y-2">
        {q.data?.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <span>{c.name}</span>
            <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive" aria-label="Delete">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}