'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';


export default function AddToCart({ product, label, locale }) {
    const t = useTranslations('Product');
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [showFineControl, setShowFineControl] = useState(false);

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

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-3">
                {/* Main Controls */}
                <div className="flex items-center justify-center gap-2 p-2 bg-slate-50 rounded-xl border-2 border-slate-200 max-w-sm mx-auto">
                    <button
                        onClick={() => updateQuantity(-1)}
                        className="h-11 w-11 px-2 text-2xl font-bold text-white bg-secondary border-none rounded-lg cursor-pointer transition-all shadow-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm flex items-center justify-center"
                        title="-1m"
                    >
                        −
                    </button>

                    <div className="flex items-center gap-1 bg-white p-2 px-3 rounded-lg border-2 border-slate-300 min-w-[70px] justify-center">
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            step={showFineControl ? "0.25" : "1"}
                            className="border-none w-[40px] text-center text-lg font-bold text-secondary bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <span className="text-sm font-semibold text-slate-500">m</span>
                    </div>

                    <button
                        onClick={() => updateQuantity(1)}
                        className="h-11 w-11 px-2 text-2xl font-bold text-white bg-secondary border-none rounded-lg cursor-pointer transition-all shadow-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm flex items-center justify-center"
                        title="+1m"
                    >
                        +
                    </button>
                </div>

                {/* Fine Control Toggle & Buttons */}
                {showFineControl && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 animate-fadeIn max-w-xs mx-auto">
                        <button
                            onClick={() => updateQuantity(-0.25)}
                            className="h-8 flex-1 px-2 text-xs font-semibold text-secondary bg-white border-2 border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-[1px] active:translate-y-0"
                            title="-0.25m"
                        >
                            −0.25m
                        </button>

                        <button
                            onClick={() => updateQuantity(0.25)}
                            className="h-8 flex-1 px-2 text-xs font-semibold text-secondary bg-white border-2 border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-[1px] active:translate-y-0"
                            title="+0.25m"
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
                className="p-4 bg-primary text-white border-none font-body font-semibold uppercase tracking-wider cursor-pointer transition-colors w-full hover:bg-[#5c1313]"
                onClick={() => addToCart(product, quantity)}
            >
                {label}
            </button>
        </div>
    );
}
