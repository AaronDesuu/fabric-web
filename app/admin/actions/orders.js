'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Delete an order by ID
 * @param {string} orderId 
 */
export async function deleteOrder(orderId) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) throw error;

        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error('Error deleting order:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Mark an order as finished (delivered)
 * @param {string} orderId 
 */
export async function markOrderAsFinished(orderId) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'delivered' })
            .eq('id', orderId);

        if (error) throw error;

        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: error.message };
    }
}
