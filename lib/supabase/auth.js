/**
 * Supabase Authentication Helper Functions - SERVER SIDE ONLY
 * Use these functions in Server Components and API routes
 */

import { createClient } from './server';

/**
 * Get current user from session (server-side)
 * @returns {Promise<{user: Object|null, error: Object|null}>}
 */
export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
}

/**
 * Check if user is an admin (server-side)
 * @param {string} userId - User UUID
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
    if (!userId) return false;

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return false;
    }

    return true;
}

/**
 * Check if user is a super admin (server-side)
 * @param {string} userId - User UUID
 * @returns {Promise<boolean>}
 */
export async function isSuperAdmin(userId) {
    if (!userId) return false;

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return false;
    }

    return data.role === 'super_admin';
}

/**
 * Get admin user details (server-side)
 * @param {string} userId - User UUID
 * @returns {Promise<{admin: Object|null, error: Object|null}>}
 */
export async function getAdminUser(userId) {
    if (!userId) return { admin: null, error: { message: 'No user ID provided' } };

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        return { admin: null, error };
    }

    return { admin: data, error: null };
}

/**
 * Require admin access - throws redirect if not admin (server-side)
 * Use in server components to protect pages
 * @returns {Promise<{user: Object, admin: Object}>}
 * @throws {redirect} Redirects to login if not authenticated or not admin
 */
export async function requireAdmin() {
    const { user, error } = await getCurrentUser();

    if (error || !user) {
        return { user: null, admin: null, authorized: false };
    }

    const adminCheck = await isAdmin(user.id);

    if (!adminCheck) {
        return { user, admin: null, authorized: false };
    }

    const { admin } = await getAdminUser(user.id);

    return { user, admin, authorized: true };
}

/**
 * Get all admin users (server-side, super_admin only)
 * @returns {Promise<{admins: Array, error: Object|null}>}
 */
export async function getAllAdmins() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return { admins: [], error };
    }

    return { admins: data, error: null };
}

/**
 * Add new admin user (server-side, super_admin only)
 * @param {string} userId - User UUID from auth.users
 * @param {string} email - User email
 * @param {string} fullName - User full name
 * @param {string} role - 'admin' or 'super_admin'
 * @returns {Promise<{admin: Object|null, error: Object|null}>}
 */
export async function addAdmin(userId, email, fullName, role = 'admin') {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('admin_users')
        .insert({
            id: userId,
            email,
            full_name: fullName,
            role,
            created_by: user?.id
        })
        .select()
        .single();

    if (error) {
        return { admin: null, error };
    }

    return { admin: data, error: null };
}

/**
 * Remove admin user (server-side, super_admin only)
 * @param {string} userId - Admin user UUID to remove
 * @returns {Promise<{success: boolean, error: Object|null}>}
 */
export async function removeAdmin(userId) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

    if (error) {
        return { success: false, error };
    }

    return { success: true, error: null };
}

/**
 * Update admin last login timestamp
 * @param {string} userId - Admin user UUID
 */
export async function updateLastLogin(userId) {
    const supabase = await createClient();

    await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
}
