'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import ConfirmationModal from './ConfirmationModal';


export default function CartSidebar({ locale }) {
    const t = useTranslations('Navigation');
    const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity } = useCart();
    const [itemToRemove, setItemToRemove] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);

    // if (!isOpen) return null; // Removed to allow exit animations

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
            setItemToRemove(item.id);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-[2000] flex justify-end transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsOpen(false)}
                />

                {/* Sidebar */}
                <div
                    className={`relative w-[400px] max-w-full h-full bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-heading text-xl text-primary font-bold">Shopping Cart ({cart.length})</h2>
                        <button className="bg-transparent border-none text-3xl cursor-pointer hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-gray-400 mb-4 text-lg font-medium">{t('emptyCart')}</p>
                                <button onClick={() => setIsOpen(false)} className="text-primary underline hover:text-[#5c1313] transition-colors font-medium">
                                    {t('returnToShop')}
                                </button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex flex-col gap-3 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 transition-all hover:shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-base text-secondary font-semibold m-0 leading-snug">{item.name[locale] || item.name['en']}</h4>
                                        <p className="text-primary font-semibold text-[0.95rem] m-0 shrink-0 ml-2">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="w-full">
                                        {editingItemId === item.id ? (
                                            <div className="flex flex-col gap-3 animate-fadeIn">
                                                {/* Increment Controls */}
                                                <div className="flex items-center justify-between gap-1 bg-white p-1.5 rounded-lg border border-slate-300 shadow-sm w-full">
                                                    <button
                                                        onClick={() => changeQuantity(item, -1)}
                                                        title="-1m"
                                                        className="h-8 flex-1 min-w-[32px] px-0 text-sm font-bold text-white bg-secondary border-none rounded-md cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-px active:translate-y-0"
                                                    >
                                                        −1
                                                    </button>
                                                    <button
                                                        onClick={() => changeQuantity(item, -0.25)}
                                                        title="-0.25m"
                                                        className="h-7 flex-1 min-w-[36px] px-0 text-[10px] font-semibold text-secondary bg-slate-50 border border-slate-200 rounded-md cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary active:scale-95"
                                                    >
                                                        −.25
                                                    </button>
                                                    <span className="font-bold min-w-[48px] text-center text-[0.95rem] text-secondary tabular-nums">{item.quantity}m</span>
                                                    <button
                                                        onClick={() => changeQuantity(item, 0.25)}
                                                        title="+0.25m"
                                                        className="h-7 flex-1 min-w-[36px] px-0 text-[10px] font-semibold text-secondary bg-slate-50 border border-slate-200 rounded-md cursor-pointer transition-all hover:bg-secondary hover:text-white hover:border-secondary active:scale-95"
                                                    >
                                                        +.25
                                                    </button>
                                                    <button
                                                        onClick={() => changeQuantity(item, 1)}
                                                        title="+1m"
                                                        className="h-8 flex-1 min-w-[32px] px-0 text-sm font-bold text-white bg-secondary border-none rounded-md cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-px active:translate-y-0"
                                                    >
                                                        +1
                                                    </button>
                                                </div>

                                                {/* Done & Trash Row */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setEditingItemId(null)}
                                                        className="flex-1 h-9 px-3 text-sm font-bold text-white bg-primary border-none rounded-md cursor-pointer transition-colors hover:bg-[#5c1313] shadow-sm"
                                                    >
                                                        {t('done')}
                                                    </button>

                                                    <button
                                                        onClick={() => setItemToRemove(item.id)}
                                                        className="w-9 h-9 border border-slate-200 bg-white rounded-md p-2 text-slate-400 flex items-center justify-center transition-all cursor-pointer hover:text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm"
                                                        aria-label={locale === 'id' ? 'Hapus' : 'Remove'}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-[0.95rem] text-secondary bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                                                        {item.quantity}m
                                                    </span>
                                                    <button
                                                        onClick={() => setEditingItemId(item.id)}
                                                        className="text-xs font-semibold text-primary underline hover:text-[#5c1313] bg-transparent border-none cursor-pointer p-0"
                                                    >
                                                        {t('change')}
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => setItemToRemove(item.id)}
                                                    className="w-9 h-9 border border-slate-200 bg-white rounded-md p-2 text-slate-400 flex items-center justify-center transition-all cursor-pointer hover:text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm"
                                                    aria-label={locale === 'id' ? 'Hapus' : 'Remove'}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
                        <div className="flex justify-between text-xl font-bold mb-4 font-heading items-baseline">
                            <span className="text-gray-600 font-medium text-lg">{t('total')}:</span>
                            <span className="text-primary text-2xl">{formatPrice(total)}</span>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                window.location.href = `/${locale}/checkout`;
                            }}
                            className="w-full p-4 bg-primary text-white border-none text-base cursor-pointer disabled:bg-[#ccc] disabled:cursor-not-allowed hover:bg-[#5c1313] transition-all transform hover:-translate-y-1 hover:shadow-lg font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 group"
                            disabled={cart.length === 0}
                        >
                            <span>Checkout</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
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
