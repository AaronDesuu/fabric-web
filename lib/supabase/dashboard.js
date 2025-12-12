import { createClient } from './server';

/**
 * Get dashboard statistics
 * @returns {Promise<{ totalProducts: number, lowStock: number, pendingOrders: number, totalAdmins: number }>}
 */
export async function getDashboardStats() {
    const supabase = await createClient();

    try {
        // 1. Total Active Products
        const { count: totalProducts, error: productsError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('active', true);

        if (productsError) throw productsError;

        // 2. Low Stock Products (< 10 meters)
        // Note: 'lt' filter on numeric column
        const { count: lowStock, error: lowStockError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('active', true)
            .lt('stock_meters', 10);

        if (lowStockError) throw lowStockError;

        // 3. Pending Orders
        const { count: pendingOrders, error: ordersError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (ordersError) throw ordersError;

        // 4. Total Admins
        const { count: totalAdmins, error: adminsError } = await supabase
            .from('admin_users')
            .select('*', { count: 'exact', head: true });

        if (adminsError) throw adminsError;

        return {
            totalProducts: totalProducts || 0,
            lowStock: lowStock || 0,
            pendingOrders: pendingOrders || 0,
            totalAdmins: totalAdmins || 0
        };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalProducts: 0,
            lowStock: 0,
            pendingOrders: 0,
            totalAdmins: 0
        };
    }
}

/**
 * Get recent orders
 * @param {number} limit 
 * @returns {Promise<Array>}
 */
export async function getRecentOrders(limit = 5) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}
