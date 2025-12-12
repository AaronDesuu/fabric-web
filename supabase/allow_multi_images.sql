-- ============================================
-- ENABLE MULTIPLE IMAGES FOR PRODUCTS
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add image_urls column (text array) to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

-- 2. Migrate existing single images to the new array
-- This ensures current products have their image in the new format
UPDATE public.products 
SET image_urls = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_urls = '{}';

-- 3. Update products RLS to ensuring admin can manage this column
-- (Existing "Products are manageable by admins" policy covers ALL columns, so no change needed)
-- Just ensuring the column is exposed to the API is enough.

-- 4. Create a trigger to keep the legacy image_url in sync with the first image of image_urls
-- This ensures standard product lists (which use image_url) continue to work
CREATE OR REPLACE FUNCTION public.sync_legacy_image_url()
RETURNS TRIGGER AS $$
BEGIN
    -- If image_urls has items, set image_url to the first item
    IF NEW.image_urls IS NOT NULL AND array_length(NEW.image_urls, 1) > 0 THEN
        NEW.image_url = NEW.image_urls[1];
    ELSE
        -- If array is empty or null, clear image_url
        NEW.image_url = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_product_images
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_legacy_image_url();

-- Done! Now products support up to 3 images (or more) via the image_urls column.
