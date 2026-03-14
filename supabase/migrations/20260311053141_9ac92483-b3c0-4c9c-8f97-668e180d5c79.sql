
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Frontend',
  percentage integer NOT NULL DEFAULT 50 CHECK (percentage >= 0 AND percentage <= 100),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are viewable by everyone"
  ON public.skills FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins can insert skills"
  ON public.skills FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update skills"
  ON public.skills FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete skills"
  ON public.skills FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
