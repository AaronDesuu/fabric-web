'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import ConfirmationModal from './ConfirmationModal';


export default function CartSidebar({ locale }) {
    const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity } = useCart();
    const [itemToRemove, setItemToRemove] = useState(null);

    if (!isOpen) return null;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const formatPrice = (amount) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const confirmRemove = () => {
        if (itemToRemove) {
            removeFromCart(itemToRemove);
            setItemToRemove(null);
        }
    };

    const changeQuantity = (item, amount) => {
        const newQty = item.quantity + amount;
        if (newQty >= 1) {
            updateQuantity(item.id, newQty);
        } else {
            // Logic: If result is < 1, ask to remove. 
            // This covers: 
            // 1.0 - 0.25 = 0.75 (<1) -> Confirm Remove
            // 1.25 - 1.0 = 0.25 (<1) -> Confirm Remove
            setItemToRemove(item.id);
        }
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-[2000] flex justify-end" onClick={() => setIsOpen(false)}>
                <div className="w-[400px] max-w-full h-full bg-white flex flex-col animate-slideIn" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-heading text-xl text-primary font-bold">Shopping Cart ({cart.length})</h2>
                        <button className="bg-transparent border-none text-3xl cursor-pointer hover:text-primary" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <p className="text-center text-[#999] mt-8">Your cart is empty</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex flex-col gap-3 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-base text-secondary font-semibold m-0">{item.name[locale] || item.name['en']}</h4>
                                        <p className="text-primary font-semibold text-[0.95rem] m-0">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-1 bg-white p-1.5 rounded-lg border border-slate-300">
                                            <button
                                                onClick={() => changeQuantity(item, -1)}
                                                title="-1m"
                                                className="h-9 min-w-[42px] px-2 text-base font-bold text-white bg-secondary border-none rounded-md cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-px active:translate-y-0"
                                            >
                                                −1
                                            </button>
                                            <button
                                                onClick={() => changeQuantity(item, -0.25)}
                                                title="-0.25m"
                                                className="h-7 min-w-[48px] px-2 text-xs font-semibold text-secondary bg-slate-100 border border-slate-300 rounded-md cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary active:scale-95"
                                            >
                                                −0.25
                                            </button>
                                            <span className="font-bold min-w-[42px] text-center text-[0.95rem] text-secondary">{item.quantity}m</span>
                                            <button
                                                onClick={() => changeQuantity(item, 0.25)}
                                                title="+0.25m"
                                                className="h-7 min-w-[48px] px-2 text-xs font-semibold text-secondary bg-slate-100 border border-slate-300 rounded-md cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary active:scale-95"
                                            >
                                                +0.25
                                            </button>
                                            <button
                                                onClick={() => changeQuantity(item, 1)}
                                                title="+1m"
                                                className="h-9 min-w-[42px] px-2 text-base font-bold text-white bg-secondary border-none rounded-md cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-px active:translate-y-0"
                                            >
                                                +1
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setItemToRemove(item.id)}
                                            className="w-9 h-9 border border-slate-200 bg-white rounded-md p-2 text-slate-400 flex items-center justify-center transition-all cursor-pointer hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                                            aria-label={locale === 'id' ? 'Hapus' : 'Remove'}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between text-xl font-bold mb-4 font-heading">
                            <span>Total:</span>
                            <span className="text-primary">{formatPrice(total)}</span>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                window.location.href = `/${locale}/checkout`;
                            }}
                            className="w-full p-4 bg-primary text-white border-none text-base cursor-pointer disabled:bg-[#ccc] disabled:cursor-not-allowed hover:bg-[#5c1313] transition-colors font-semibold uppercase tracking-wider"
                            disabled={cart.length === 0}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!itemToRemove}
                onClose={() => setItemToRemove(null)}
                onConfirm={confirmRemove}
                title={locale === 'id' ? 'Hapus Produk?' : 'Remove Product?'}
                message={locale === 'id' ? 'Apakah Anda yakin ingin menghapus produk ini dari keranjang?' : 'Are you sure you want to remove this product from your cart?'}
                confirmText={locale === 'id' ? 'Hapus' : 'Remove'}
                cancelText={locale === 'id' ? 'Batal' : 'Cancel'}
            />
        </>
    );
}
