-- ============================================
-- FABRIC STORE DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
create table public.products (
    id uuid primary key default uuid_generate_v4(),
    name_en text not null,
    name_id text not null,
    description_en text,
    description_id text,
    price decimal(10,2) not null,
    stock_meters decimal(10,2) default 0,
    category text,
    image_url text,
    featured boolean default false,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- PRODUCT IMAGES TABLE (for multiple images per product)
-- ============================================
create table public.product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade,
    image_url text not null,
    is_primary boolean default false,
    sort_order int default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete set null,
    -- Customer info (for guest checkout)
    customer_name text,
    customer_phone text,
    customer_email text,
    customer_address text,
    -- Order details
    total_amount decimal(10,2) not null,
    status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method text default 'whatsapp',
    notes text,
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
create table public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    -- Store product info at time of purchase
    product_name_en text not null,
    product_name_id text not null,
    quantity_meters decimal(10,2) not null,
    price_per_meter decimal(10,2) not null,
    subtotal decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- USER PROFILES TABLE (extends auth.users)
-- ============================================
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    phone text,
    address text,
    city text,
    postal_code text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- INDEXES for better performance
-- ============================================
create index idx_products_category on public.products(category);
create index idx_products_featured on public.products(featured) where featured = true;
create index idx_products_active on public.products(active) where active = true;
create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_order_items_product_id on public.order_items(product_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.profiles enable row level security;

-- Products: Public read access
create policy "Products are viewable by everyone"
    on public.products for select
    using (active = true);

-- Products: Only admins can insert/update/delete (you'll add admin role later)
create policy "Products are manageable by admins"
    on public.products for all
    using (auth.role() = 'authenticated');

-- Product Images: Public read access
create policy "Product images are viewable by everyone"
    on public.product_images for select
    using (true);

-- Orders: Users can view their own orders
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

-- Orders: Anyone can create orders (for guest checkout)
create policy "Anyone can create orders"
    on public.orders for insert
    with check (true);

-- Order Items: Users can view items from their orders
create policy "Users can view their order items"
    on public.order_items for select
    using (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );

-- Order Items: Anyone can create order items (for checkout)
create policy "Anyone can create order items"
    on public.order_items for insert
    with check (true);

-- Profiles: Users can view their own profile
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

-- Profiles: Users can update their own profile
create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();

create trigger handle_orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();

create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile when user signs up
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- ============================================
-- INITIAL DATA (optional)
-- You can add some sample categories here
-- ============================================

-- Add your product categories as needed
-- Example:
-- insert into public.products (name_en, name_id, price, category, featured, active) values
-- ('Sample Fabric', 'Kain Contoh', 50000, 'cotton', true, true);
