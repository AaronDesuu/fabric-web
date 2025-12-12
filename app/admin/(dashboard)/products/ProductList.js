'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

export default function ProductList({ products }) {
    const router = useRouter();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [deleting, setDeleting] = useState(false);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(products.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const handleDeleteSelected = async () => {
        if (selectedProducts.length === 0) return;

        const confirmMessage = selectedProducts.length === 1
            ? 'Are you sure you want to delete this product?'
            : `Are you sure you want to delete ${selectedProducts.length} products?`;

        if (!confirm(confirmMessage)) return;

        setDeleting(true);
        const supabase = createClient();

        const { error } = await supabase
            .from('products')
            .delete()
            .in('id', selectedProducts);

        if (error) {
            alert('Failed to delete product(s): ' + error.message);
        } else {
            setSelectedProducts([]);
            router.refresh();
        }
        setDeleting(false);
    };

    const handleDeleteSingle = async (productId, productName) => {
        if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

        setDeleting(true);
        const supabase = createClient();

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) {
            alert('Failed to delete product: ' + error.message);
        } else {
            router.refresh();
        }
        setDeleting(false);
    };

    return (
        <div>
            {/* Desktop Bulk Delete Button */}
            {selectedProducts.length > 0 && (
                <div className="hidden lg:flex mb-4 items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <span className="text-sm text-blue-800">
                        {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                    </span>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={deleting}
                        className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deleting ? 'Deleting...' : 'Delete Selected'}
                    </button>
                </div>
            )}

            {/* Mobile Floating Action Buttons */}
            {selectedProducts.length > 0 && (
                <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                    {/* Cancel Selection Button */}
                    <button
                        onClick={() => setSelectedProducts([])}
                        className="flex items-center justify-center w-14 h-14 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                        title="Cancel selection"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Delete Selected Button */}
                    <button
                        onClick={handleDeleteSelected}
                        disabled={deleting}
                        className="flex flex-col items-center justify-center w-14 h-14 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                        title="Delete selected products"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-xs mt-0.5">{selectedProducts.length}</span>
                    </button>
                </div>
            )}

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {products.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No products found.{' '}
                        <Link href="/admin/products/new" className="text-blue-600 hover:text-blue-700">
                            Add your first product
                        </Link>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex gap-4">
                                {/* Checkbox */}
                                <div className="flex-shrink-0 flex items-start pt-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleSelectProduct(product.id)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>

                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name_en}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate">{product.name_en}</h3>
                                    <p className="text-sm text-gray-500 truncate">{product.name_id}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="text-sm text-gray-600 capitalize">{product.category || '-'}</span>
                                        <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.active ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                Inactive
                                            </span>
                                        )}
                                        {product.featured && (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Featured
                                            </span>
                                        )}
                                        {product.stock_meters && (
                                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                {product.stock_meters}m
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteSingle(product.id, product.name_en)}
                                            disabled={deleting}
                                            className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={products.length > 0 && selectedProducts.length === products.length}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Featured
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                        No products found.{' '}
                                        <Link href="/admin/products/new" className="text-blue-600 hover:text-blue-700">
                                            Add your first product
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => handleSelectProduct(product.id)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name_en}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name_en}</div>
                                            <div className="text-sm text-gray-500">{product.name_id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 capitalize">
                                                {product.category || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.stock_meters ? `${product.stock_meters}m` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.active ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.featured ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteSingle(product.id, product.name_en)}
                                                    disabled={deleting}
                                                    className="inline-flex items-center p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:bg-red-50 disabled:cursor-not-allowed transition-colors"
                                                    title="Delete product"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
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
