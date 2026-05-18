
CREATE TABLE public.nav_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label_ar text NOT NULL,
  label_en text NOT NULL,
  url text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY nav_links_select_all ON public.nav_links FOR SELECT TO public USING (true);
CREATE POLICY nav_links_admin_write ON public.nav_links FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_nav_links_updated_at BEFORE UPDATE ON public.nav_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.nav_links (label_ar, label_en, url, sort_order) VALUES
  ('الرئيسية', 'Home', '/', 0),
  ('كورية', 'Korean', '/category/korean', 1),
  ('تركية', 'Turkish', '/category/turkish', 2),
  ('إنجليزية', 'English', '/category/english', 3),
  ('الرائجة', 'Trending', '/category/trending', 4),
  ('جديد', 'New', '/category/new', 5);
