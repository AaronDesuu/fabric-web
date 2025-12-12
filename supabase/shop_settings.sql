-- Create table for global shop settings
-- We enforce a single row by checking id=1

CREATE TABLE IF NOT EXISTS public.shop_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    whatsapp_number TEXT NOT NULL DEFAULT '6281234567890',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read stats (needed for frontend)
CREATE POLICY "Settings are viewable by everyone" 
ON public.shop_settings FOR SELECT 
USING (true);

-- Only admins can update
CREATE POLICY "Settings are updateable by admins" 
ON public.shop_settings FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Insert default row if not exists
INSERT INTO public.shop_settings (id, whatsapp_number)
VALUES (1, '6281234567890')
ON CONFLICT (id) DO NOTHING;

-- Trigger for updated_at
CREATE TRIGGER handle_shop_settings_updated_at
    BEFORE UPDATE ON public.shop_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
