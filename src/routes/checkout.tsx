import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/SiteNav";
import { useCart, formatPKR } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Elclassico" }, { name: "description", content: "Complete your order." }],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone"),
  address: z.string().trim().min(8, "Full address required").max(400),
  notes: z.string().max(400).optional(),
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Please sign in to place your order.");
      navigate({ to: "/auth" });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.user_metadata?.full_name && !form.name) {
      setForm((f) => ({ ...f, name: user.user_metadata.full_name as string }));
    }
  }, [user]); // eslint-disable-line

  if (items.length === 0) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <SiteNav />
        <div className="pt-40 text-center px-6">
          <p>Your cart is empty.</p>
          <Link to="/menu" className="mt-4 inline-block underline">Go to menu</Link>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!user) return;
    setSubmitting(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
          customer_address: form.address.trim(),
          notes: form.notes?.trim() || null,
          payment_method: "cod",
          subtotal,
          delivery_fee: deliveryFee,
          total,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;

      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          menu_item_id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      );
      if (itemsErr) throw itemsErr;

      clear();
      toast.success("Order placed! We're preparing it now.");
      navigate({ to: "/my-orders" });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>
          <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl">Delivery Details</h2>
              <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="e.g. 0300 1234567" />
              <Field label="Delivery Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} textarea />
              <Field label="Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment</label>
                <div className="mt-2 rounded-xl border border-border bg-background px-4 py-3 text-sm">
                  Cash on Delivery
                </div>
              </div>
              <button
                disabled={submitting}
                className="w-full rounded-full bg-foreground text-background py-3 text-sm font-medium disabled:opacity-60"
              >
                {submitting ? "Placing order…" : `Place Order · ${formatPKR(total)}`}
              </button>
            </form>
            <aside className="rounded-2xl border border-border bg-card p-6 h-fit">
              <h2 className="font-display text-2xl">Order Summary</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                    <span>{formatPKR(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPKR(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPKR(deliveryFee)}</dd></div>
                <div className="border-t border-border pt-3 flex justify-between font-display text-xl"><dt>Total</dt><dd>{formatPKR(total)}</dd></div>
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, textarea,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/40"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/40"
        />
      )}
    </div>
  );
}