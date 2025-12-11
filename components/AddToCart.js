'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './AddToCart.module.css';

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
        <div className={styles.container}>
            <div className={styles.quantityControl}>
                <div className={styles.buttonGroup}>
                    <button onClick={() => updateQuantity(-1)} className={`${styles.qtyBtn} ${styles.qtyBtnMain}`} title="-1m">-1</button>
                    <button onClick={() => updateQuantity(-0.25)} className={`${styles.qtyBtn} ${styles.qtyBtnSub}`} title="-0.25m">-0.25</button>
                </div>

                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    step="0.25"
                    className={styles.qtyInput}
                />

                <div className={styles.buttonGroup}>
                    <button onClick={() => updateQuantity(0.25)} className={`${styles.qtyBtn} ${styles.qtyBtnSub}`} title="+0.25m">+0.25</button>
                    <button onClick={() => updateQuantity(1)} className={`${styles.qtyBtn} ${styles.qtyBtnMain}`} title="+1m">+1</button>
                </div>
            </div>
            <button
                className={styles.addToCart}
                onClick={() => addToCart(product, quantity)}
            >
                {label}
            </button>
        </div>
    );
}
