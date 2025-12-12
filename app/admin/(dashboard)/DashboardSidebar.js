'use client';

import { signOut } from '@/lib/supabase/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardSidebar({ currentUser, adminData }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push('/admin/login');
        router.refresh();
    };

    const isActive = (path) => pathname.startsWith(path);

    // Get initials for avatar
    const getInitials = () => {
        if (adminData?.full_name) {
            return adminData.full_name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        if (currentUser?.email) {
            return currentUser.email[0].toUpperCase();
        }
        return 'A';
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-lg font-bold">Scorpio Admin</h1>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md hover:bg-gray-800"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo - Desktop Only */}
                    <div className="hidden lg:block px-6 py-4 border-b border-gray-800">
                        <h1 className="text-xl font-bold">Scorpio Admin</h1>
                    </div>

                    {/* Current User Card */}
                    <div className="px-4 py-4 mt-14 lg:mt-0 border-b border-gray-800">
                        <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-sm">
                                {getInitials()}
                            </div>
                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {adminData?.full_name || currentUser?.email || 'Admin User'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <Link
                            href="/admin/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/products')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Products
                        </Link>
                        <Link
                            href="/admin/orders"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/orders')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Orders
                        </Link>
                        <Link
                            href="/admin/users"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Users
                        </Link>
                    </nav>

                    {/* Logout */}
                    <div className="px-4 py-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
