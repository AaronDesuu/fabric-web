'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';

export default function ProductSlider({ products, locale }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { addToCart } = useCart();

    // Auto-advance
    useEffect(() => {
        if (!products || products.length === 0) return;
        const timer = setInterval(() => {
            handleNext();
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, [currentIndex, products?.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (!products || products.length === 0) return null;

    // Price Formatting Helper
    const formatPrice = (price) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="mb-16 relative w-full max-w-6xl mx-auto px-4">

            <div className="relative bg-white min-h-[500px] md:min-h-[450px] overflow-hidden rounded-2xl">

                {/* CSS Grid for Stacking Slides */}
                <div className="grid grid-cols-1 grid-rows-1 h-[500px] md:h-auto">
                    {products.map((product, index) => {
                        const isActive = index === currentIndex;

                        return (
                            <div
                                key={product.id}
                                className={`col-start-1 row-start-1 w-full h-full transition-opacity duration-[1500ms] ease-in-out flex flex-col md:flex-row items-center gap-8 md:gap-16 py-0 md:py-0 ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                            >
                                {/* Mobile Background Image */}
                                <div className="absolute inset-0 md:hidden z-0">
                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40"></div>
                                </div>

                                {/* LEFT: Text Content */}
                                <div className="flex-1 flex flex-col items-start justify-end md:justify-center w-full h-full pb-20 md:pb-0 pl-8 md:pl-28 pr-4 z-10">
                                    <Link href={`/shop/${product.id}`} className="group">
                                        <h3 className="text-2xl md:text-6xl font-heading font-bold uppercase tracking-[0.2em] text-white md:text-gray-900 leading-tight group-hover:text-primary transition-colors drop-shadow-md md:drop-shadow-none">
                                            {product.name[locale]}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-4 text-lg md:text-2xl mt-1 mb-2 text-white/90 md:text-gray-900">
                                        <span className="font-medium md:font-bold drop-shadow-md md:drop-shadow-none">{formatPrice(product.price)} / m</span>
                                    </div>

                                    <div className="mt-2 md:mt-6">
                                        {/* Mobile: Minimal Text Button */}
                                        <button
                                            onClick={() => addToCart(product, 1)}
                                            className="md:hidden text-sm font-bold uppercase tracking-widest text-white border-b border-white pb-1 hover:text-gray-200 transition-colors"
                                        >
                                            {locale === 'id' ? 'BELANJA SEKARANG' : 'SHOP NOW'}
                                        </button>

                                        {/* Desktop: Solid Button */}
                                        <button
                                            onClick={() => addToCart(product, 1)}
                                            className="hidden md:block px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-md"
                                        >
                                            {locale === 'id' ? 'Tambah ke Keranjang' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT: Image (Desktop Only) */}
                                <div className="hidden md:flex flex-1 relative justify-center items-center">
                                    {/* Blob (Only animate if active to save performance?) */}
                                    <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-gray-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

                                    {/* Image */}
                                    <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                        <img
                                            src={product.image}
                                            alt={product.name[locale]}
                                            className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${isActive ? 'scale-100' : 'scale-110'}`}
                                        />
                                    </div>

                                    {/* Badge */}
                                    {product.is_sale && (
                                        <div className="absolute top-0 right-10 bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                                            SALE
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Arrows (Z-Index High to sit on top) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-2 border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors z-20 shadow-sm rounded-full md:rounded-none"
                    aria-label="Previous slide"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors z-20 shadow-sm rounded-full md:rounded-none"
                    aria-label="Next slide"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {products.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'bg-gray-800 w-8' : 'bg-gray-300 hover:bg-white'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

            </div>

        </div>
    );
}
