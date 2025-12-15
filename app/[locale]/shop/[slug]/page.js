import ProductInterface from '@/components/ProductInterface';
import { getProductById, getRelatedProducts } from '@/lib/supabase/products';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';


export async function generateStaticParams() {
    const locales = ['en', 'id'];
    const params = [];

    // Use direct Supabase client for build-time static generation
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Fetch all products from Supabase for static generation
    const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('active', true);

    // If products exist, generate params
    if (products && products.length > 0) {
        for (const locale of locales) {
            for (const product of products) {
                params.push({
                    locale: locale,
                    slug: product.id
                });
            }
        }
    }

    return params;
}

export default async function ProductPage({ params }) {
    const { slug, locale } = await params;

    // Fetch product from Supabase
    const product = await getProductById(slug);

    if (!product) {
        notFound();
    }

    // Fetch related products
    const relatedProducts = await getRelatedProducts(product.id, product.category);

    // NOTE: In a real app we would use `getTranslations`
    const tProduct = {
        addToCart: locale === 'id' ? 'Tambah ke Keranjang' : 'Add to Cart',
        description: locale === 'id' ? 'Deskripsi' : 'Description'
    };

    return (
        <ProductInterface
            product={product}
            locale={locale}
            tProduct={tProduct}
            variants={product.variants}
            relatedProducts={relatedProducts}
        />
    );
}
