-- Create bucket for promotion images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('promotions', 'promotions', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for viewing promotion images
CREATE POLICY "Promotion images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'promotions');

-- Create policy for uploading promotion images
CREATE POLICY "Anyone can upload promotion images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'promotions');

-- Create policy for updating promotion images
CREATE POLICY "Anyone can update promotion images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'promotions');

-- Create policy for deleting promotion images
CREATE POLICY "Anyone can delete promotion images"
ON storage.objects FOR DELETE
USING (bucket_id = 'promotions');