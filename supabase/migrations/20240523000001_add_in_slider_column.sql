-- Add in_slider column to products table
ALTER TABLE products 
ADD COLUMN in_slider BOOLEAN DEFAULT false;

-- Comment for clarity
COMMENT ON COLUMN products.in_slider IS 'Flag to determine if the product should appear in the primary shop slider';
