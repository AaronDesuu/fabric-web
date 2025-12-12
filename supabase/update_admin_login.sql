-- ============================================
-- UPDATE ADMIN LAST LOGIN RPC
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the function first to allow return type changes if it already exists
DROP FUNCTION IF EXISTS public.update_admin_last_login();

-- Function to update the last_login timestamp for the current user
-- Uses SECURITY DEFINER to bypass RLS policies (since regular admins can't update users)
CREATE OR REPLACE FUNCTION public.update_admin_last_login()
RETURNS VOID AS $$
BEGIN
    UPDATE public.admin_users
    SET last_login = NOW()
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_admin_last_login() TO authenticated;
