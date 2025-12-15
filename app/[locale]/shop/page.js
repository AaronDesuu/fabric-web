import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/ProductCard';
import ProductSlider from '@/components/ProductSlider';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import AutoOpenCart from '@/components/AutoOpenCart';
import { getProducts } from '@/lib/supabase/products';


export default async function ShopPage({ params, searchParams }) {
    const { locale } = await params;
    const { q, category } = await searchParams;
    const query = q ? q.toLowerCase() : '';

    // Support multiple categories (comma-separated)
    const selectedCategories = category ? category.toLowerCase().split(',').filter(Boolean) : [];

    // Fetch products from Supabase
    const allProducts = await getProducts();
    const sliderProducts = allProducts.filter(p => p.in_slider);

    // Filter products based on search and category
    const filteredProducts = allProducts.filter(product => {
        const name = product.name[locale].toLowerCase();
        const desc = product.description[locale].toLowerCase();
        const matchesSearch = name.includes(query) || desc.includes(query);

        // Match if any selected category matches, or if no category filter
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);

        return matchesSearch && matchesCategory;
    });

    const t = await getTranslations({ locale, namespace: 'Shop' });

    const categories = [
        { value: 'cotton', label: locale === 'id' ? 'Katun' : 'Cotton' },
        { value: 'silk', label: locale === 'id' ? 'Sutra' : 'Silk' },
        { value: 'linen', label: locale === 'id' ? 'Linen' : 'Linen' },
        { value: 'velvet', label: locale === 'id' ? 'Beludru' : 'Velvet' },
    ];

    return (
        <div className="pt-4 pb-24 md:pb-16 max-w-container mx-auto px-4">
            {sliderProducts.length > 0 && (
                <ProductSlider
                    products={sliderProducts}
                    locale={locale}
                    title={locale === 'id' ? 'Koleksi Unggulan' : 'Featured Collection'}
                />
            )}

            <div className="flex flex-col gap-4 mb-10">
                <div className="text-center py-8 max-w-[800px] mx-auto md:py-6">
                    <h1 className="text-4xl md:text-5xl font-heading text-primary mb-4 leading-tight">
                        {t('title')}
                    </h1>
                    <p className="text-lg md:text-[1.125rem] text-secondary leading-relaxed m-0 opacity-90">
                        {t('description')}
                    </p>
                </div>
            </div>

            <div className="sticky top-[80px] z-50 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-black/5 flex gap-2 items-center flex-nowrap mb-8 md:gap-4 md:flex-wrap">
                <SearchBar placeholder={locale === 'id' ? 'Cari kain...' : 'Search fabrics...'} />
                <CategoryFilter categories={categories} locale={locale} />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 mb-8">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-[#666] p-8 text-lg">
                        {locale === 'id' ? 'Tidak ada produk ditemukan' : 'No products found'}
                    </p>
                )}
            </div>
            <AutoOpenCart />
        </div>
    );
}
