-- Create vacation_periods table
CREATE TABLE public.vacation_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Enable Row Level Security
ALTER TABLE public.vacation_periods ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (needed for checking availability)
CREATE POLICY "Public can view vacation periods" 
ON public.vacation_periods 
FOR SELECT 
USING (true);

CREATE POLICY "Public can manage vacation periods" 
ON public.vacation_periods 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vacation_periods_updated_at
BEFORE UPDATE ON public.vacation_periods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();