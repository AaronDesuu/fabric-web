'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('fabric_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                // Migrate old items to have cartItemId
                const migrated = parsed.map(item => ({
                    ...item,
                    cartItemId: item.cartItemId || item.id,
                    variant: item.variant || null
                }));
                setCart(migrated);
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('fabric_cart', JSON.stringify(cart));
    }, [cart, isInitialized]);

    const addToCart = (product, quantity = 1, variant = null) => {
        setCart((prev) => {
            const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
            const existing = prev.find((item) => item.cartItemId === cartItemId);

            if (existing) {
                return prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, {
                ...product,
                quantity,
                variant,
                cartItemId
            }];
        });
        setIsOpen(true);
    };

    const removeFromCart = (cartItemId) => {
        setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, quantity) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
