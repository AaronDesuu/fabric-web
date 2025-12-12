-- ============================================
-- ADD PRODUCT VARIANTS (COLOR OPTIONS)
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create product_variants table
create table public.product_variants (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade,
    variant_name text not null, -- e.g. "Color"
    variant_value text not null, -- e.g. "Red", "Navy Blue"
    stock_meters decimal(10,2) default 0,
    price_adjustment decimal(10,2) default 0, -- Allow + or - price
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.product_variants enable row level security;

-- Policies
create policy "Variants are viewable by everyone"
    on public.product_variants for select
    using (true);

create policy "Variants are manageable by admins"
    on public.product_variants for all
    using (auth.role() = 'authenticated');

-- 2. Add variant support to order_items
alter table public.order_items
add column variant_id uuid references public.product_variants(id) on delete set null,
add column variant_name text; -- Stores "Color: Red" snapshot

-- 3. Trigger for updated_at
create trigger handle_product_variants_updated_at
    before update on public.product_variants
    for each row
    execute function public.handle_updated_at();

-- Done!
