'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function ProductCard({ product, locale }) {
    const t = useTranslations('Product');

    // Format price in IDR
    const price = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(product.price);

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-200 relative hover:-translate-y-1 hover:shadow-lg group" title={`${product.name[locale]} - ${price}`}>
            <Link href={`/shop/${product.id}`} className="block relative h-[250px] overflow-hidden bg-[#f5f5f0]">
                <img src={product.image} alt={product.name[locale]} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-black/60 text-white flex flex-col gap-1 backdrop-blur-sm">
                    <span className="font-heading text-base font-semibold">{product.name[locale]}</span>
                    <span className="text-sm text-[#ffd700]">{price} / m</span>
                </div>
            </Link>
            {/* Hidden info block, kept in code but hidden as per original CSS */}
            <div className="hidden p-6">
                <Link href={`/shop/${product.id}`}>
                    <h3 className="font-heading text-xl mb-2 text-primary">{product.name[locale]}</h3>
                </Link>
                <p className="text-lg font-semibold text-secondary mb-4">
                    {price} <span className="text-sm text-gray-500 font-normal">{t('perMeter')}</span>
                </p>
                <button className="w-full p-3 bg-black text-white rounded font-medium transition-colors hover:bg-gray-800">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
