ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS emailjs_service_id TEXT DEFAULT 'service_i7n84gh',
  ADD COLUMN IF NOT EXISTS emailjs_template_id TEXT DEFAULT 'template_5259pag',
  ADD COLUMN IF NOT EXISTS emailjs_public_key TEXT DEFAULT 'nvu_-r-AfKOOXC-xQ',
  ADD COLUMN IF NOT EXISTS emailjs_enabled BOOLEAN DEFAULT true;