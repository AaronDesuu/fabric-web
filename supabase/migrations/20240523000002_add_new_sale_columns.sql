-- Add is_new and is_sale columns to products table
ALTER TABLE products 
ADD COLUMN is_new BOOLEAN DEFAULT false,
ADD COLUMN is_sale BOOLEAN DEFAULT false;

-- Comments
COMMENT ON COLUMN products.is_new IS 'Flag for New Arrival status';
COMMENT ON COLUMN products.is_sale IS 'Flag for On Sale status';
