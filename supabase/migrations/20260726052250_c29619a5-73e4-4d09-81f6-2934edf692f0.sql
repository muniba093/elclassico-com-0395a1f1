ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS online_payment_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_instructions text NOT NULL DEFAULT '';