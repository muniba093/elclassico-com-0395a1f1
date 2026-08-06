import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Deal = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discount_percent: number;
  valid_till: string | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
};

export function discountedPrice(d: Pick<Deal, "original_price" | "discount_percent">) {
  const p = Number(d.original_price) * (1 - Number(d.discount_percent) / 100);
  return Math.max(0, Math.round(p));
}

export function isExpired(d: Pick<Deal, "valid_till">) {
  if (!d.valid_till) return false;
  return new Date(d.valid_till).getTime() <= Date.now();
}

export function useActiveDeals() {
  return useQuery({
    queryKey: ["deals", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Deal[]).filter((d) => !isExpired(d));
    },
  });
}