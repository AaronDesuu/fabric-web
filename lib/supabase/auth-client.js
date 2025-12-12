/**
 * Supabase Authentication Helper Functions - CLIENT SIDE ONLY
 * Use these functions in 'use client' components
 */

import { createClient } from './client';

/**
 * Sign in with email and password (client-side)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: Object|null, error: Object|null}>}
 */
export async function signInWithEmail(email, password) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { user: null, error };
    }

    return { user: data.user, error: null };
}

/**
 * Sign out current user (client-side)
 * @returns {Promise<{error: Object|null}>}
 */
export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Get current session (client-side)
 * @returns {Promise<{session: Object|null, error: Object|null}>}
 */
export async function getSession() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session, error };
}
