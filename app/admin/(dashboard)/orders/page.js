import { createClient } from '@/lib/supabase/server';
import OrdersTable from '@/components/admin/OrdersTable';

async function getOrders() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data || [];
}

export default async function OrdersPage() {
    // Fetch fresh data on each request (or rely on Server Action revalidation)
    const orders = await getOrders();

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage customer orders</p>
            </div>

            <OrdersTable initialOrders={orders} />
        </div>
    );
}
