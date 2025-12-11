import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { products } from '@/lib/products';
import styles from './ShopPage.module.css';

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
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>
                        {t('shop')}
                    </h1>
                </div>
            </div>

            <div className={styles.filterBar}>
                <SearchBar placeholder={locale === 'id' ? 'Cari kain...' : 'Search fabrics...'} />
                <CategoryFilter categories={categories} locale={locale} />
            </div>

            <div className={styles.productGrid}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))
                ) : (
                    <p className={styles.emptyState}>
                        {locale === 'id' ? 'Tidak ada produk ditemukan' : 'No products found'}
                    </p>
                )}
            </div>
        </div>
    );
}
