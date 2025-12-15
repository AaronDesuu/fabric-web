'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AlertDialog from '@/components/ui/AlertDialog';

function formatDate(dateString) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function AdminUserList({ admins, currentUserId, isSuperAdmin }) {
    const router = useRouter();
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

    const confirmRemoveAdmin = (adminId) => {
        setDialog({
            isOpen: true,
            title: 'Remove Admin',
            description: 'Are you sure you want to remove this admin? This action cannot be undone.',
            confirmText: 'Remove',
            type: 'danger',
            showCancel: true,
            onConfirm: () => handleRemoveAdmin(adminId)
        });
    };

    const handleRemoveAdmin = async (adminId) => {
        closeDialog(); // Optimistically close
        const supabase = createClient();

        const { error } = await supabase
            .from('admin_users')
            .delete()
            .eq('id', adminId);

        if (error) {
            setDialog({
                isOpen: true,
                title: 'Error',
                description: 'Failed to remove admin: ' + error.message,
                type: 'danger',
                showCancel: false,
                confirmText: 'Close',
                onConfirm: closeDialog
            });
        } else {
            router.refresh();
        }
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
                showCancel={dialog.showCancel}
            />

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {admins.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No admin users found.
                    </div>
                ) : (
                    admins.map((admin) => (
                        <div key={admin.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {admin.full_name || '-'}
                                        {admin.id === currentUserId && (
                                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{admin.email}</div>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${admin.role === 'super_admin'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                                <div>Created: {formatDate(admin.created_at)}</div>
                                <div>Last Login: {formatDate(admin.last_login)}</div>
                            </div>
                            {isSuperAdmin && admin.id !== currentUserId && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => confirmRemoveAdmin(admin.id)}
                                        className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Login
                                </th>
                                {isSuperAdmin && (
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {admins.length === 0 ? (
                                <tr>
                                    <td colSpan={isSuperAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                                        No admin users found.
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {admin.full_name || '-'}
                                                {admin.id === currentUserId && (
                                                    <span className="ml-2 text-xs text-blue-600">(You)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${admin.role === 'super_admin'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {formatDate(admin.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {formatDate(admin.last_login)}
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                {admin.id !== currentUserId && (
                                                    <button
                                                        onClick={() => confirmRemoveAdmin(admin.id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
