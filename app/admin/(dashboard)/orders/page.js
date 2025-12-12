import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const statusColors = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
    shipped: { bg: 'bg-green-100', text: 'text-green-800' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

async function getOrders() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data || [];
}

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage customer orders</p>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No orders yet. Orders will appear here when customers place them.
                    </div>
                ) : (
                    orders.map((order) => {
                        const statusColor = statusColors[order.status] || { bg: 'bg-blue-100', text: 'text-blue-800' };
                        return (
                            <div key={order.id} className="bg-white rounded-lg shadow p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="text-xs text-gray-500 font-mono">#{order.id.substring(0, 8)}...</div>
                                        <div className="font-medium text-gray-900 mt-1">{order.customer_name || '-'}</div>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor.bg} ${statusColor.text} capitalize`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {order.customer_phone || '-'}
                                    </div>
                                    {order.customer_email && (
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {order.customer_email}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
                                    <span className="text-xs text-gray-500">{formatDate(order.created_at)}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No orders yet. Orders will appear here when customers place them.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const statusColor = statusColors[order.status] || { bg: 'bg-blue-100', text: 'text-blue-800' };
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-xs text-gray-900">
                                                    {order.id.substring(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.customer_name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{order.customer_phone || '-'}</div>
                                                <div className="text-xs text-gray-500">{order.customer_email || ''}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatPrice(order.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor.bg} ${statusColor.text} capitalize`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                                {formatDate(order.created_at)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
