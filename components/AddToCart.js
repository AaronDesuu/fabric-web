'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';


export default function AddToCart({ product, label }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

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
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                <button
                    onClick={() => updateQuantity(-1)}
                    className="h-12 min-w-[56px] px-4 text-xl font-bold text-white bg-secondary border-none rounded-lg cursor-pointer transition-all shadow-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
                    title="-1m"
                >
                    <span className="text-xl">−1</span>
                </button>

                <button
                    onClick={() => updateQuantity(-0.25)}
                    className="h-9 min-w-[60px] px-3 text-sm font-semibold text-secondary bg-white border-2 border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-[1px] active:translate-y-0"
                    title="-0.25m"
                >
                    −0.25
                </button>

                <div className="flex items-center gap-1 bg-white p-2 px-3 rounded-lg border-2 border-slate-300 min-w-[80px] justify-center">
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        step="0.25"
                        className="border-none w-[45px] text-center text-lg font-bold text-secondary bg-transparent outline-none appearance-none"
                    />
                    <span className="text-sm font-semibold text-slate-500">m</span>
                </div>

                <button
                    onClick={() => updateQuantity(0.25)}
                    className="h-9 min-w-[60px] px-3 text-sm font-semibold text-secondary bg-white border-2 border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-[1px] active:translate-y-0"
                    title="+0.25m"
                >
                    +0.25
                </button>

                <button
                    onClick={() => updateQuantity(1)}
                    className="h-12 min-w-[56px] px-4 text-xl font-bold text-white bg-secondary border-none rounded-lg cursor-pointer transition-all shadow-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
                    title="+1m"
                >
                    <span className="text-xl">+1</span>
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
