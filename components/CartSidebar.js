'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import ConfirmationModal from './ConfirmationModal';
import styles from './CartSidebar.module.css';

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
            <div className={styles.overlay} onClick={() => setIsOpen(false)}>
                <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <h2>Shopping Cart ({cart.length})</h2>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className={styles.items}>
                        {cart.length === 0 ? (
                            <p className={styles.empty}>Your cart is empty</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <h4>{item.name[locale] || item.name['en']}</h4>
                                        <p className={styles.price}>{formatPrice(item.price)}</p>
                                    </div>
                                    <div className={styles.controls}>
                                        <div className={styles.qtyGroup}>
                                            <button onClick={() => changeQuantity(item, -1)} title="-1m">-1</button>
                                            <button onClick={() => changeQuantity(item, -0.25)} title="-0.25m">-0.25</button>
                                        </div>
                                        <span className={styles.qtyDisplay}>{item.quantity}m</span>
                                        <div className={styles.qtyGroup}>
                                            <button onClick={() => changeQuantity(item, 0.25)} title="+0.25m">+0.25</button>
                                            <button onClick={() => changeQuantity(item, 1)} title="+1m">+1</button>
                                        </div>
                                        <button
                                            onClick={() => setItemToRemove(item.id)}
                                            className={styles.removeBtn}
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

                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>Total:</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <button className={styles.checkoutBtn} disabled={cart.length === 0}>
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
