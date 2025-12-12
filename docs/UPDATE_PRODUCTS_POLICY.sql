-- Allow anonymous users to update product image URLs
-- This is needed for the image migration script

-- First, check if RLS is enabled on products table
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'products';

-- Create policy to allow updates to image_url
CREATE POLICY "Allow anonymous to update image_url"
ON products
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Alternative: If you want to be more restrictive and only allow updating image_url field
-- You would need to handle this in application logic instead, as PostgreSQL RLS doesn't support column-level policies directly

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'products';
