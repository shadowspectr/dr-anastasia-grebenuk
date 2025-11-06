-- Create promotions table for special offers and campaigns
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  discount_text TEXT NOT NULL DEFAULT '',
  valid_until DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT DEFAULT '',
  button_text TEXT NOT NULL DEFAULT 'ЗАПИСАТЬСЯ',
  button_link TEXT NOT NULL DEFAULT '/booking',
  priority INTEGER NOT NULL DEFAULT 0,
  
  -- SEO fields
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  
  -- Marketing fields
  utm_campaign TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  promo_code TEXT DEFAULT '',
  show_timer BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can view active promotions"
ON public.promotions
FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can manage promotions"
ON public.promotions
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON public.promotions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_promotions_active_priority ON public.promotions(is_active, priority DESC);