
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS popup_active BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS popup_title_ar TEXT,
  ADD COLUMN IF NOT EXISTS popup_title_en TEXT,
  ADD COLUMN IF NOT EXISTS popup_text_ar TEXT,
  ADD COLUMN IF NOT EXISTS popup_text_en TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.categories (id, name_ar, name_en, sort_order) VALUES
  ('korean', 'مسلسلات كورية', 'Korean Series', 1),
  ('turkish', 'مسلسلات تركية', 'Turkish Series', 2),
  ('english', 'مسلسلات أجنبية', 'English Series', 3),
  ('netflix', 'نتفليكس', 'Netflix', 4),
  ('appletv', 'آبل تي في+', 'Apple TV+', 5)
ON CONFLICT (id) DO NOTHING;
