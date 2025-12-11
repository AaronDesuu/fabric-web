import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { products } from '@/lib/products';

export default async function ShopPage({ params, searchParams }) {
    const { locale } = await params;
    const { q, category } = await searchParams;
    const query = q ? q.toLowerCase() : '';
    const categoryFilter = category ? category.toLowerCase() : '';

    const filteredProducts = products.filter(product => {
        const name = product.name[locale].toLowerCase();
        const desc = product.description[locale].toLowerCase();
        const matchesSearch = name.includes(query) || desc.includes(query);
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;

        return matchesSearch && matchesCategory;
    });

    // Use translations for the page title, falling back to Navigation messages for now
    // Ideally should have a 'Shop' namespace
    const t = await getTranslations({ locale, namespace: 'Navigation' });

    const categories = [
        { value: 'cotton', label: locale === 'id' ? 'Katun' : 'Cotton' },
        { value: 'silk', label: locale === 'id' ? 'Sutra' : 'Silk' },
        { value: 'linen', label: locale === 'id' ? 'Linen' : 'Linen' },
        { value: 'velvet', label: locale === 'id' ? 'Beludru' : 'Velvet' },
    ];

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-primary)',
                        margin: 0
                    }}>
                        {t('shop')}
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <SearchBar placeholder={locale === 'id' ? 'Cari kain...' : 'Search fabrics...'} />
                    <CategoryFilter categories={categories} locale={locale} />
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))
                ) : (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666', padding: '2rem' }}>
                        {locale === 'id' ? 'Tidak ada produk ditemukan' : 'No products found'}
                    </p>
                )}
            </div>
        </div>
    );
}
