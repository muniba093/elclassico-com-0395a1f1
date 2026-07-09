
-- SITE SETTINGS (single row)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name text NOT NULL DEFAULT 'Elclassico',
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  notification_email text NOT NULL DEFAULT 'munibaakram112@gmail.com',
  hero_title text NOT NULL DEFAULT 'Where every bite tells a story.',
  hero_subtitle text NOT NULL DEFAULT 'Fresh Pakistani BBQ, biryani, burgers & more — delivered hot.',
  about_text text NOT NULL DEFAULT '',
  is_open boolean NOT NULL DEFAULT true,
  delivery_fee numeric NOT NULL DEFAULT 150,
  min_order_amount numeric NOT NULL DEFAULT 0,
  opening_hours jsonb NOT NULL DEFAULT '{"mon":"12:00-00:00","tue":"12:00-00:00","wed":"12:00-00:00","thu":"12:00-00:00","fri":"12:00-00:00","sat":"12:00-00:00","sun":"12:00-00:00"}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER touch_site_settings BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- PROMO CODES
CREATE TYPE public.promo_type AS ENUM ('flat', 'percent', 'free_delivery');

CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type promo_type NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  min_order_amount numeric NOT NULL DEFAULT 0,
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.promo_codes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.promo_codes TO authenticated;
GRANT ALL ON public.promo_codes TO service_role;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promo public read active" ON public.promo_codes FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "promo admin all" ON public.promo_codes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER touch_promo BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Allow admins to see all user_roles (for the Users tab)
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add promo/discount columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_code text,
  ADD COLUMN IF NOT EXISTS discount numeric NOT NULL DEFAULT 0;
