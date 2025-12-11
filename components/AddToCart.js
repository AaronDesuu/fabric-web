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
                <button
                    onClick={() => updateQuantity(-1)}
                    className={styles.qtyBtnLarge}
                    title="-1m"
                >
                    <span className={styles.mainAction}>−1</span>
                </button>

                <button
                    onClick={() => updateQuantity(-0.25)}
                    className={styles.qtyBtnSmall}
                    title="-0.25m"
                >
                    −0.25
                </button>

                <div className={styles.quantityDisplay}>
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        step="0.25"
                        className={styles.qtyInput}
                    />
                    <span className={styles.unit}>m</span>
                </div>

                <button
                    onClick={() => updateQuantity(0.25)}
                    className={styles.qtyBtnSmall}
                    title="+0.25m"
                >
                    +0.25
                </button>

                <button
                    onClick={() => updateQuantity(1)}
                    className={styles.qtyBtnLarge}
                    title="+1m"
                >
                    <span className={styles.mainAction}>+1</span>
                </button>
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
