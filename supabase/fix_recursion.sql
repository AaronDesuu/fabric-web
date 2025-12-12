-- ============================================
-- FIX FOR INFINITE RECURSION ERROR
-- Run this in Supabase SQL Editor to fix the issue
-- ============================================

-- Step 1: Create security definer functions that bypass RLS
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

-- Step 2: Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can insert admins" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can update admins" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete admins" ON public.admin_users;
DROP POLICY IF EXISTS "Products are manageable by admins" ON public.products;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Step 3: Recreate policies using the security definer functions

-- Admin users policies
CREATE POLICY "Admins can view admin list"
    ON public.admin_users FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Super admins can insert admins"
    ON public.admin_users FOR INSERT
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can update admins"
    ON public.admin_users FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super admins can delete admins"
    ON public.admin_users FOR DELETE
    USING (public.is_super_admin() AND id != auth.uid());

-- Products policy
CREATE POLICY "Products are manageable by admins"
    ON public.products FOR ALL
    USING (public.is_admin());

-- Orders policies
CREATE POLICY "Admins can view all orders"
    ON public.orders FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- Order items policy
CREATE POLICY "Admins can view all order items"
    ON public.order_items FOR SELECT
    USING (public.is_admin());

-- Done! The infinite recursion should now be fixed.
