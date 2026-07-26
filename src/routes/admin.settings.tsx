import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings, DAYS, type SiteSettings } from "@/lib/site-settings";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const qc = useQueryClient();
  const q = useSiteSettings();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (q.data && !form) setForm(q.data); }, [q.data, form]);

  if (!form) return <div className="text-muted-foreground">Loading…</div>;

  const update = (patch: Partial<SiteSettings>) => setForm({ ...form, ...patch });
  const setHour = (day: string, val: string) =>
    setForm({ ...form, opening_hours: { ...form.opening_hours, [day]: val } as any });

  async function save() {
    if (!form) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      restaurant_name: form.restaurant_name,
      address: form.address,
      phone: form.phone,
      contact_email: form.contact_email,
      notification_email: form.notification_email,
      hero_title: form.hero_title,
      hero_subtitle: form.hero_subtitle,
      about_text: form.about_text,
      is_open: form.is_open,
      delivery_fee: Number(form.delivery_fee) || 0,
      min_order_amount: Number(form.min_order_amount) || 0,
      opening_hours: form.opening_hours,
      online_payment_enabled: form.online_payment_enabled,
      payment_instructions: form.payment_instructions,
      emailjs_service_id: form.emailjs_service_id,
      emailjs_template_id: form.emailjs_template_id,
      emailjs_public_key: form.emailjs_public_key,
      emailjs_enabled: form.emailjs_enabled,
    }).eq("id", form.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <Section title="Restaurant status">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={form.is_open} onChange={(e) => update({ is_open: e.target.checked })} className="h-5 w-5" />
          <span className="text-sm">Currently accepting orders</span>
        </label>
        <p className="text-xs text-muted-foreground mt-2">When off, customers see a "Closed" banner and cannot checkout.</p>
      </Section>

      <Section title="Basic info">
        <Input label="Restaurant name" value={form.restaurant_name} onChange={(v) => update({ restaurant_name: v })} />
        <Input label="Phone" value={form.phone} onChange={(v) => update({ phone: v })} />
        <Input label="Contact email (shown publicly)" value={form.contact_email} onChange={(v) => update({ contact_email: v })} />
        <Textarea label="Address" value={form.address} onChange={(v) => update({ address: v })} />
      </Section>

      <Section title="Home page content">
        <Input label="Hero title" value={form.hero_title} onChange={(v) => update({ hero_title: v })} />
        <Textarea label="Hero subtitle" value={form.hero_subtitle} onChange={(v) => update({ hero_subtitle: v })} />
        <Textarea label="About text (long)" value={form.about_text} onChange={(v) => update({ about_text: v })} />
      </Section>

      <Section title="Delivery">
        <Input type="number" label="Delivery fee (Rs.)" value={String(form.delivery_fee)} onChange={(v) => update({ delivery_fee: Number(v) })} />
        <Input type="number" label="Minimum order amount (Rs.)" value={String(form.min_order_amount)} onChange={(v) => update({ min_order_amount: Number(v) })} />
      </Section>

      <Section title="Online payment">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={!!form.online_payment_enabled} onChange={(e) => update({ online_payment_enabled: e.target.checked })} className="h-5 w-5" />
          <span className="text-sm">Enable online payment option at checkout</span>
        </label>
        <Textarea
          label="Payment instructions (bank / JazzCash / EasyPaisa details shown to customer)"
          value={form.payment_instructions ?? ""}
          onChange={(v) => update({ payment_instructions: v })}
        />
      </Section>

      <Section title="Notifications">
        <Input label="New-order notification email" value={form.notification_email} onChange={(v) => update({ notification_email: v })} />
        <p className="text-xs text-muted-foreground">You'll receive a copy of every new order at this address.</p>
      </Section>

      <Section title="EmailJS configuration">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={!!form.emailjs_enabled} onChange={(e) => update({ emailjs_enabled: e.target.checked })} className="h-5 w-5" />
          <span className="text-sm">Send order emails via EmailJS</span>
        </label>
        <Input label="Service ID" value={form.emailjs_service_id ?? ""} onChange={(v) => update({ emailjs_service_id: v })} />
        <Input label="Template ID" value={form.emailjs_template_id ?? ""} onChange={(v) => update({ emailjs_template_id: v })} />
        <Input label="Public Key" value={form.emailjs_public_key ?? ""} onChange={(v) => update({ emailjs_public_key: v })} />
        <p className="text-xs text-muted-foreground">
          Template variables sent on each new order: <code className="text-[10px]">to_email, order_id, customer_name, customer_phone, customer_address, notes, items, subtotal, discount, delivery_fee, total, promo_code, payment_method</code>
        </p>
      </Section>

      <Section title="Opening hours">
        <div className="space-y-2">
          {DAYS.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="w-28 text-sm">{d.label}</span>
              <input
                value={form.opening_hours[d.key] ?? ""}
                onChange={(e) => setHour(d.key, e.target.value)}
                placeholder="12:00-00:00 or Closed"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      </Section>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <h2 className="font-display text-xl">{title}</h2>
      {children}
    </div>
  );
}
function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground/40" />
    </div>
  );
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground/40" />
    </div>
  );
}