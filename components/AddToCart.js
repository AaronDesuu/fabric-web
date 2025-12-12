'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';


export default function AddToCart({ product, label, locale, variants = [], selectedVariant: propSelectedVariant, onSelectVariant }) {
    const t = useTranslations('Product');
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [showFineControl, setShowFineControl] = useState(false);

    // Support controlled or uncontrolled mode
    const isControlled = propSelectedVariant !== undefined;
    const [internalSelectedVariant, setInternalSelectedVariant] = useState(null);
    const selectedVariant = isControlled ? propSelectedVariant : internalSelectedVariant;

    const handleSelectVariant = (v) => {
        if (isControlled) {
            if (onSelectVariant) onSelectVariant(v);
        } else {
            setInternalSelectedVariant(v);
        }
    };

    // Default to first variant if available (only for uncontrolled)
    useEffect(() => {
        if (!isControlled && variants && variants.length > 0) {
            setInternalSelectedVariant(variants[0]);
        } else if (!isControlled) {
            setInternalSelectedVariant(null);
        }
    }, [variants, isControlled]);

    const updateQuantity = (change) => {
        setQuantity(prev => {
            const newValue = prev + change;
            return newValue >= 1 ? newValue : prev; // Don't go below 1
        });
    };

    const handleQuantityChange = (e) => {
        const val = parseFloat(e.target.value);
        if (val >= 1) {
            setQuantity(val);
        }
    };

    // stock check (optional, basic check against variant stock if selected)
    const currentStock = selectedVariant ? parseFloat(selectedVariant.stock_meters) : parseFloat(product.stock || 0);
    const isOutOfStock = currentStock <= 0;

    const handleAddToCart = () => {
        if (variants.length > 0 && !selectedVariant) {
            // Should be handled by default selection, but safety check
            return;
        }
        addToCart(product, quantity, selectedVariant);
    };

    const variantLabelRaw = variants.length > 0 ? (variants[0].variant_name || 'Option') : '';
    const variantLabel = variantLabelRaw === 'Color' ? t('color') : variantLabelRaw;

    const getVariantValue = (v) => {
        if (!v) return '';
        if (locale === 'id') return v.variant_value_id || v.variant_value;
        return v.variant_value_en || v.variant_value;
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Variant Selector */}
            {variants.length > 0 && (
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">
                        {variantLabel}: <span className="text-primary font-bold">{getVariantValue(selectedVariant)}</span>
                    </label>
                    <div className="grid grid-cols-5 md:grid-cols-5 gap-2 md:gap-3">
                        {variants.map(v => {
                            const isSelected = selectedVariant?.id === v.id;
                            const hasImage = !!v.variant_image;

                            return (
                                <button
                                    key={v.id}
                                    onClick={() => handleSelectVariant(v)}
                                    className={`relative flex flex-col items-center gap-2 p-2 rounded-lg border transition-all hover:bg-gray-50 bg-white ${isSelected
                                        ? 'border-secondary ring-2 ring-offset-1 ring-secondary shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 shadow-sm'
                                        }`}
                                >
                                    {/* Image Thumbnail */}
                                    <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-100 relative">
                                        {hasImage ? (
                                            <img
                                                src={v.variant_image}
                                                alt={getVariantValue(v)}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                {/* Placeholder Icon */}
                                                <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Label */}
                                    <span className={`text-[0.8rem] font-medium text-center leading-tight line-clamp-2 ${isSelected ? 'text-secondary' : 'text-gray-600'}`}>
                                        {getVariantValue(v)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {/* Main Controls */}
                <div className="flex items-center justify-center gap-2 p-2 bg-slate-50 rounded-xl border-2 border-slate-200 max-w-sm mx-auto w-full">
                    <button
                        onClick={() => updateQuantity(-1)}
                        className="h-11 w-11 px-2 text-2xl font-bold text-white bg-secondary border-none rounded-lg cursor-pointer transition-all shadow-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm flex items-center justify-center"
                        title="-1m"
                        disabled={isOutOfStock}
                    >
                        −
                    </button>

                    <div className="flex items-center gap-1 bg-white p-2 px-3 rounded-lg border-2 border-slate-300 min-w-[70px] justify-center flex-1">
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            max={currentStock}
                            step={showFineControl ? "0.25" : "1"}
                            className="border-none w-full text-center text-lg font-bold text-secondary bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            disabled={isOutOfStock}
                        />
                        <span className="text-sm font-semibold text-slate-500">m</span>
                    </div>

                    <button
                        onClick={() => updateQuantity(1)}
                        className="h-11 w-11 px-2 text-2xl font-bold text-white bg-secondary border-none rounded-lg cursor-pointer transition-all shadow-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm flex items-center justify-center"
                        title="+1m"
                        disabled={isOutOfStock}
                    >
                        +
                    </button>
                </div>

                {/* Fine Control Toggle & Buttons */}
                {showFineControl && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 animate-fadeIn max-w-xs mx-auto w-full">
                        <button
                            onClick={() => updateQuantity(-0.25)}
                            className="h-8 flex-1 px-2 text-xs font-semibold text-secondary bg-white border-2 border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-[1px] active:translate-y-0"
                            title="-0.25m"
                            disabled={isOutOfStock}
                        >
                            −0.25m
                        </button>

                        <button
                            onClick={() => updateQuantity(0.25)}
                            className="h-8 flex-1 px-2 text-xs font-semibold text-secondary bg-white border-2 border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-[1px] active:translate-y-0"
                            title="+0.25m"
                            disabled={isOutOfStock}
                        >
                            +0.25m
                        </button>
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={() => setShowFineControl(!showFineControl)}
                    className="text-xs font-semibold text-primary hover:text-[#5c1313] underline bg-transparent border-none cursor-pointer p-2 transition-colors"
                >
                    {showFineControl ? t('hideFineControl') : t('showFineControl')}
                </button>
            </div>

            <button
                className="p-4 bg-primary text-white border-none font-body font-semibold uppercase tracking-wider cursor-pointer transition-colors w-full hover:bg-[#5c1313] disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
            >
                {isOutOfStock ? (locale === 'id' ? 'Stok Habis' : 'Out of Stock') : label}
            </button>
        </div>
    );
}
