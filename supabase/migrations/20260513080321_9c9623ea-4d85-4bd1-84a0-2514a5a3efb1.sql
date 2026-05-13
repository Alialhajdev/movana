
-- Add background image and related ids to series
ALTER TABLE public.series
  ADD COLUMN IF NOT EXISTS background_image TEXT,
  ADD COLUMN IF NOT EXISTS related_ids JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_delete_own_or_admin" ON public.reviews FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_reviews_series_id ON public.reviews(series_id);

-- Storage bucket for series images (posters/backgrounds)
INSERT INTO storage.buckets (id, name, public)
VALUES ('series-images', 'series-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "series_images_public_read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'series-images');

CREATE POLICY "series_images_admin_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'series-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "series_images_admin_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'series-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "series_images_admin_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'series-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
