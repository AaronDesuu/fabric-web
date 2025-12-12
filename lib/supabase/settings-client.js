import { createClient } from './client';

/**
 * Update shop settings (Client-side)
 * @param {Object} updates - Settings to update
 * @returns {Promise<{ settings: Object|null, error: Object|null }>}
 */
export async function updateShopSettings(updates) {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('shop_settings')
            .update(updates)
            .eq('id', 1)
            .select()
            .single();

        if (error) return { settings: null, error };

        return { settings: data, error: null };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { settings: null, error };
    }
}
