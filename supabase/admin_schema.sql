-- ============================================
-- ADMIN DASHBOARD SCHEMA ADDITIONS
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    last_login TIMESTAMPTZ
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- ============================================
-- SECURITY DEFINER FUNCTION TO CHECK ADMIN
-- This avoids infinite recursion in RLS policies
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- ENABLE RLS ON ADMIN_USERS
-- ============================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR ADMIN_USERS
-- Using security definer functions to avoid recursion
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can insert admins" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can update admins" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete admins" ON public.admin_users;

-- Admins can view the admin list
CREATE POLICY "Admins can view admin list"
    ON public.admin_users FOR SELECT
    USING (public.is_admin());

-- Super admins can insert new admins
CREATE POLICY "Super admins can insert admins"
    ON public.admin_users FOR INSERT
    WITH CHECK (public.is_super_admin());

-- Super admins can update admins
CREATE POLICY "Super admins can update admins"
    ON public.admin_users FOR UPDATE
    USING (public.is_super_admin());

-- Super admins can delete admins (except themselves)
CREATE POLICY "Super admins can delete admins"
    ON public.admin_users FOR DELETE
    USING (public.is_super_admin() AND id != auth.uid());

-- ============================================
-- UPDATE PRODUCTS RLS FOR ADMIN ACCESS
-- ============================================

-- Drop existing admin policy if it exists
DROP POLICY IF EXISTS "Products are manageable by admins" ON public.products;

-- Create new policy: Admins can do all operations on products
CREATE POLICY "Products are manageable by admins"
    ON public.products FOR ALL
    USING (public.is_admin());

-- ============================================
-- UPDATE ORDERS RLS FOR ADMIN ACCESS
-- ============================================

-- Drop if exists first to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
    ON public.orders FOR SELECT
    USING (public.is_admin());

-- Admins can update orders (change status, etc.)
CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- ============================================
-- UPDATE ORDER_ITEMS RLS FOR ADMIN ACCESS
-- ============================================

-- Drop if exists first
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
    ON public.order_items FOR SELECT
    USING (public.is_admin());

-- ============================================
-- INSTRUCTIONS FOR FIRST ADMIN USER
-- ============================================
-- After running this script:
-- 
-- 1. Create a user via Supabase Auth (Dashboard > Authentication > Users > Add user)
--    Use your email and a secure password
--
-- 2. Run this SQL to make them a super_admin (replace with your user ID):
--
--    INSERT INTO public.admin_users (id, email, full_name, role)
--    VALUES (
--        'YOUR-USER-UUID-HERE',
--        'your-email@example.com',
--        'Your Name',
--        'super_admin'
--    );
--
-- 3. You can then log in and add more admins through the admin panel
-- ============================================
