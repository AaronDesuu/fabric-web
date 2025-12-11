'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, locale }) {
    const t = useTranslations('Product');
    const { addToCart } = useCart();

    // Format price in IDR
    const price = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(product.price);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-200 relative hover:-translate-y-1 hover:shadow-lg group" title={`${product.name[locale]} - ${price}`}>
            <Link href={`/shop/${product.id}`} className="block relative h-[250px] overflow-hidden bg-[#f5f5f0]">
                <img src={product.image} alt={product.name[locale]} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-black/60 text-white flex flex-col gap-1 backdrop-blur-sm">
                    <span className="font-heading text-base font-semibold">{product.name[locale]}</span>
                    <span className="text-sm text-[#ffd700]">{price} / m</span>
                </div>

                {/* Add to Cart Button - appears on hover */}
                <button
                    onClick={handleAddToCart}
                    className="absolute top-3 right-3 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-[#5c1313] hover:scale-110 z-10"
                    title={t('addToCart') || 'Add to Cart'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </button>
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
