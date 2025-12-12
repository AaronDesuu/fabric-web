-- Rename existing value column to English
ALTER TABLE product_variants RENAME COLUMN variant_value TO variant_value_en;

-- Add Indonesian value column
ALTER TABLE product_variants ADD COLUMN variant_value_id text;

-- Copy English values to Indonesian as fallback
UPDATE product_variants SET variant_value_id = variant_value_en;
