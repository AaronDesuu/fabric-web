import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductList from './ProductList';

async function getProducts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your product catalog</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </Link>
            </div>

            <ProductList products={products} />
        </div>
    );
}
