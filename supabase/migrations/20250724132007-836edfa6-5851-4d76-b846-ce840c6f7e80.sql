-- Create table for privacy policy documents
CREATE TABLE public.privacy_policy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Политика конфиденциальности',
  document_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.privacy_policy ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" 
ON public.privacy_policy 
FOR SELECT 
USING (true);

CREATE POLICY "Enable all access for privacy_policy" 
ON public.privacy_policy 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_privacy_policy_updated_at
BEFORE UPDATE ON public.privacy_policy
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default record
INSERT INTO public.privacy_policy (title, document_url) 
VALUES ('Политика конфиденциальности', '');