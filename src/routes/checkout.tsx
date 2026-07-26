import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/SiteNav";
import { useCart, formatPKR } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteSettings } from "@/lib/site-settings";
import emailjs from "@emailjs/browser";

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
  const settingsQ = useSiteSettings();
  const settings = settingsQ.data;
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<null | { id: string; code: string; type: "flat" | "percent" | "free_delivery"; value: number; min_order_amount: number; usage_limit: number | null; used_count: number }>(null);
  const [promoErr, setPromoErr] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const baseDelivery = Number(settings?.delivery_fee ?? 150);
  const freeDelivery = promo?.type === "free_delivery";
  const deliveryFee = freeDelivery ? 0 : baseDelivery;
  const discount = !promo ? 0
    : promo.type === "flat" ? Math.min(promo.value, subtotal)
    : promo.type === "percent" ? Math.round((subtotal * promo.value) / 100)
    : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const minOrder = Number(settings?.min_order_amount ?? 0);
  const isOpen = settings?.is_open !== false;
  const onlineEnabled = !!settings?.online_payment_enabled;
  useEffect(() => { if (!onlineEnabled && paymentMethod === "online") setPaymentMethod("cod"); }, [onlineEnabled, paymentMethod]);

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

  async function applyPromo() {
    setPromoErr("");
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const { data, error } = await supabase.from("promo_codes").select("*").eq("code", code).eq("active", true).maybeSingle();
    if (error || !data) { setPromoErr("Invalid or expired code"); setPromo(null); return; }
    if (subtotal < Number(data.min_order_amount)) {
      setPromoErr(`Requires min. order of Rs. ${data.min_order_amount}`); setPromo(null); return;
    }
    if (data.usage_limit != null && data.used_count >= data.usage_limit) {
      setPromoErr("This code has reached its usage limit"); setPromo(null); return;
    }
    setPromo(data as any);
    toast.success(`Promo "${data.code}" applied`);
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoErr("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!isOpen) { toast.error("Restaurant is currently closed."); return; }
    if (subtotal < minOrder) { toast.error(`Minimum order is Rs. ${minOrder}`); return; }
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
          payment_method: paymentMethod,
          subtotal,
          delivery_fee: deliveryFee,
          discount,
          promo_code: promo?.code ?? null,
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

      if (promo) {
        await supabase.from("promo_codes").update({ used_count: promo.used_count + 1 }).eq("id", promo.id);
      }

      // Fire-and-forget email notification to restaurant owner
      try {
        const serviceId = settings?.emailjs_service_id;
        const templateId = settings?.emailjs_template_id;
        const publicKey = settings?.emailjs_public_key;
        const emailEnabled = settings?.emailjs_enabled !== false;
        if (emailEnabled && serviceId && templateId && publicKey) {
        const itemsList = items.map((i) => `${i.name} × ${i.quantity} — ${formatPKR(i.price * i.quantity)}`).join("\n");
        await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: settings?.notification_email || "munibaakram112@gmail.com",
            order_id: order.id.slice(0, 8).toUpperCase(),
            customer_name: form.name.trim(),
            customer_phone: form.phone.trim(),
            customer_address: form.address.trim(),
            notes: form.notes?.trim() || "-",
            items: itemsList,
            subtotal: formatPKR(subtotal),
            discount: discount > 0 ? `-${formatPKR(discount)}` : "-",
            delivery_fee: formatPKR(deliveryFee),
            total: formatPKR(total),
            promo_code: promo?.code ?? "-",
            payment_method: paymentMethod === "online" ? "Online Payment" : "Cash on Delivery",
          },
          { publicKey },
        );
        }
      } catch (mailErr) {
        console.warn("Order email failed:", mailErr);
      }

      clear();
      toast.success("Order placed! We're preparing it now.");
      navigate({ to: "/order/$id", params: { id: order.id } });
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
          {!isOpen && (
            <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
              The restaurant is currently closed. You cannot place an order right now.
            </div>
          )}
          {isOpen && subtotal < minOrder && (
            <div className="mt-6 rounded-2xl border border-border bg-muted/30 px-5 py-4 text-sm">
              Minimum order is Rs. {minOrder}. Add Rs. {minOrder - subtotal} more to checkout.
            </div>
          )}
          <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl">Delivery Details</h2>
              <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="e.g. 0300 1234567" />
              <Field label="Delivery Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} textarea />
              <Field label="Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment</label>
                <div className="mt-2 grid gap-2">
                  <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer ${paymentMethod === "cod" ? "border-foreground bg-muted/40" : "border-border bg-background"}`}>
                    <input type="radio" name="pm" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mt-1" />
                    <span><span className="font-medium">Cash on Delivery</span><br/><span className="text-xs text-muted-foreground">Pay in cash when your order arrives.</span></span>
                  </label>
                  {onlineEnabled && (
                    <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer ${paymentMethod === "online" ? "border-foreground bg-muted/40" : "border-border bg-background"}`}>
                      <input type="radio" name="pm" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="mt-1" />
                      <span className="flex-1">
                        <span className="font-medium">Online Payment</span><br/>
                        <span className="text-xs text-muted-foreground">Bank / JazzCash / EasyPaisa transfer.</span>
                        {paymentMethod === "online" && settings?.payment_instructions && (
                          <span className="mt-2 block whitespace-pre-wrap rounded-lg bg-background border border-border p-3 text-xs">{settings.payment_instructions}</span>
                        )}
                      </span>
                    </label>
                  )}
                </div>
              </div>
              <button
                disabled={submitting || !isOpen || subtotal < minOrder}
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
              <div className="mt-5 border-t border-border pt-4">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Promo code</label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm uppercase"
                  />
                  <button type="button" onClick={applyPromo} className="rounded-full bg-foreground text-background px-4 py-2 text-sm">
                    Apply
                  </button>
                </div>
                {promoErr && <p className="mt-2 text-xs text-destructive">{promoErr}</p>}
                {promo && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs">
                    <span className="text-emerald-600">Applied: <strong>{promo.code}</strong></span>
                    <button type="button" onClick={removePromo} className="text-muted-foreground hover:text-destructive underline">Remove</button>
                  </div>
                )}
              </div>
              <dl className="mt-5 space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPKR(subtotal)}</dd></div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{formatPKR(discount)}</dd></div>
                )}
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