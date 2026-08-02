import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OpeningHours = Record<"mon"|"tue"|"wed"|"thu"|"fri"|"sat"|"sun", string>;

export type HomeImage = { image_url: string; name: string; tag: string };

export type SiteSettings = {
  id: string;
  restaurant_name: string;
  address: string;
  phone: string;
  contact_email: string;
  notification_email: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  is_open: boolean;
  delivery_fee: number;
  min_order_amount: number;
  opening_hours: OpeningHours;
  online_payment_enabled: boolean;
  payment_instructions: string;
  emailjs_service_id: string;
  emailjs_template_id: string;
  emailjs_public_key: string;
  emailjs_enabled: boolean;
  logo_url: string;
  hero_image_url: string;
  home_images: HomeImage[];
  banner_enabled: boolean;
  banner_text: string;
  banner_cta_label: string;
  banner_cta_link: string;
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data as unknown as SiteSettings | null;
    },
  });
}

export const DAYS: { key: keyof OpeningHours; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];