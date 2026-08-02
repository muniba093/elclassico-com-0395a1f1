ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS logo_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS home_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS banner_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banner_text text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS banner_cta_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS banner_cta_link text NOT NULL DEFAULT '';