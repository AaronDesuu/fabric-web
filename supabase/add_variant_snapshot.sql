-- Add variant_snapshot column to order_items table to store variant details key-values
-- This allows us to persist "Color: Red" etc. alongside the order Item

ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS variant_snapshot JSONB DEFAULT '{}'::jsonb;

-- Comment on column
COMMENT ON COLUMN public.order_items.variant_snapshot IS 'Stores snapshot of variant details at time of purchase, e.g. {"en": "Color: Red", "id": "Warna: Merah"}';
