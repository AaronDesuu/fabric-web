import { createClient } from './server';

/**
 * Get shop settings (WhatsApp number, etc.)
 * @returns {Promise<{ settings: Object|null, error: Object|null }>}
 */
export async function getShopSettings() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('shop_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            // If row doesn't exist (shouldn't happen with seed), return default
            if (error.code === 'PGRST116') {
                return { settings: { whatsapp_number: '6281234567890' }, error: null };
            }
            return { settings: null, error };
        }

        return { settings: data, error: null };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { settings: null, error };
    }
}

/**
 * Update shop settings
 * @param {Object} updates - Settings to update
 * @returns {Promise<{ settings: Object|null, error: Object|null }>}
 */
export async function updateShopSettings(updates) {
    const supabase = await createClient();

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
