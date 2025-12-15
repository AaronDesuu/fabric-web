'use client';

import { useState } from 'react';
import { deleteOrder, markOrderAsFinished } from '@/app/admin/actions/orders';
import AlertDialog from '@/components/ui/AlertDialog';

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
    delivered: { bg: 'bg-green-800', text: 'text-green-100' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

function getStatusGroup(status) {
    if (['delivered', 'cancelled'].includes(status)) return 'finished';
    return 'unfinished';
}

function calculateTotalQuantity(items) {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.quantity_meters || 0), 0);
}

export default function OrdersTable({ initialOrders }) {
    const [orders, setOrders] = useState(initialOrders);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [loading, setLoading] = useState(null); // id of order being processed

    // Dialog State
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: '',
        description: '',
        confirmText: 'Confirm',
        type: 'info',
        onConfirm: null,
        showCancel: true
    });

    const closeDialog = () => setDialog(prev => ({ ...prev, isOpen: false }));

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortConfig.key === 'quantity') {
            const qtyA = calculateTotalQuantity(a.order_items);
            const qtyB = calculateTotalQuantity(b.order_items);
            if (qtyA < qtyB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (qtyA > qtyB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }
        if (sortConfig.key === 'status') {
            const statusA = getStatusGroup(a.status);
            const statusB = getStatusGroup(b.status);
            if (statusA < statusB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (statusA > statusB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }
        // Default string/date sort
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return (
            <svg className="w-3 h-3 text-gray-300 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        );
        return sortConfig.direction === 'asc' ? (
            <svg className="w-3 h-3 text-gray-600 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-3 h-3 text-gray-600 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const confirmDelete = (orderId) => {
        setDialog({
            isOpen: true,
            title: 'Delete Order',
            description: 'Are you sure you want to delete this order? This action cannot be undone and will remove all associated data.',
            confirmText: 'Delete Order',
            type: 'danger',
            showCancel: true,
            onConfirm: () => handleDelete(orderId)
        });
    };

    const confirmFinish = (orderId) => {
        setDialog({
            isOpen: true,
            title: 'Mark as Finished',
            description: 'Are you sure you want to mark this order as finished? The status will be updated to "Delivered".',
            confirmText: 'Mark Finished',
            type: 'success',
            showCancel: true,
            onConfirm: () => handleFinish(orderId)
        });
    };

    const handleDelete = async (orderId) => {
        setLoading(orderId);
        // Optimistically close dialog
        closeDialog();

        const result = await deleteOrder(orderId);

        if (result.success) {
            setOrders(orders.filter(o => o.id !== orderId));
        } else {
            console.error(result.error);
            // Show error dialog
            setDialog({
                isOpen: true,
                title: 'Error',
                description: 'Failed to delete order: ' + result.error,
                type: 'danger',
                showCancel: false,
                confirmText: 'Close',
                onConfirm: closeDialog
            });
        }
        setLoading(null);
    };

    const handleFinish = async (orderId) => {
        setLoading(orderId);
        closeDialog();

        const result = await markOrderAsFinished(orderId);

        if (result.success) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
        } else {
            // Show error dialog
            setDialog({
                isOpen: true,
                title: 'Error',
                description: 'Failed to update order: ' + result.error,
                type: 'danger',
                showCancel: false,
                confirmText: 'Close',
                onConfirm: closeDialog
            });
        }
        setLoading(null);
    };

    return (
        <div>
            <AlertDialog
                isOpen={dialog.isOpen}
                onClose={closeDialog}
                onConfirm={dialog.onConfirm}
                title={dialog.title}
                description={dialog.description}
                confirmText={dialog.confirmText}
                type={dialog.type}
                isLoading={loading !== null && dialog.type !== 'danger' && dialog.type !== 'success'}
                showCancel={dialog.showCancel}
            />

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                {sortedOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No orders found.
                    </div>
                ) : (
                    sortedOrders.map((order) => {
                        const statusColor = statusColors[order.status] || { bg: 'bg-blue-100', text: 'text-blue-800' };
                        const totalMeters = calculateTotalQuantity(order.order_items);
                        const isFinished = order.status === 'delivered';

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
                                    <div className="flex justify-between text-gray-600">
                                        <span>Items:</span>
                                        <span className="font-mono">{totalMeters.toFixed(1)}m</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total:</span>
                                        <span className="font-semibold text-gray-900">{formatPrice(order.total_amount)}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 text-right">{formatDate(order.created_at)}</div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2 justify-end">
                                    {!isFinished && (
                                        <button
                                            onClick={() => confirmFinish(order.id)}
                                            disabled={loading === order.id}
                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {loading === order.id ? '...' : 'Finish'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => confirmDelete(order.id)}
                                        disabled={loading === order.id}
                                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* Order ID */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                {/* Customer */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                {/* Quantity */}
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('quantity')}
                                >
                                    <div className="flex items-center">
                                        Quantity (m)
                                        {getSortIcon('quantity')}
                                    </div>
                                </th>
                                {/* Total */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                {/* Status */}
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center">
                                        Status
                                        {getSortIcon('status')}
                                    </div>
                                </th>
                                {/* Date */}
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center">
                                        Date
                                        {getSortIcon('created_at')}
                                    </div>
                                </th>
                                {/* Actions */}
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                sortedOrders.map((order) => {
                                    const statusColor = statusColors[order.status] || { bg: 'bg-blue-100', text: 'text-blue-800' };
                                    const totalMeters = calculateTotalQuantity(order.order_items);
                                    const isFinished = order.status === 'delivered';

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-xs text-gray-900">
                                                    {order.id.substring(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="font-medium">{order.customer_name || '-'}</div>
                                                <div className="text-xs text-gray-500">{order.customer_phone || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {totalMeters.toFixed(1)}
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
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {!isFinished && (
                                                    <button
                                                        onClick={() => confirmFinish(order.id)}
                                                        disabled={loading === order.id}
                                                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                        title="Mark as Finished"
                                                    >
                                                        {loading === order.id ? '...' : 'Finish'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => confirmDelete(order.id)}
                                                    disabled={loading === order.id}
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
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
