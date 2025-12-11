'use client';

import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';

export default function AnimatedProductCard({ product, locale, index }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        // Set mounted to true after initial render
        setIsMounted(true);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const animationDelay = `${index * 0.15}s`;

    return (
        <div
            ref={ref}
            className={isVisible ? 'animate-slideInFromLeft' : ''}
            style={{
                opacity: 0,
                transform: 'translateX(-100px)',
                animationDelay: isVisible ? animationDelay : '0s',
                animationFillMode: 'forwards',
                willChange: isVisible ? 'auto' : 'transform, opacity'
            }}
        >
            <ProductCard product={product} locale={locale} />
        </div>
    );
}
