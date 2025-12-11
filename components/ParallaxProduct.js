'use client';

import { useEffect, useRef, useState } from 'react';

export default function ParallaxProduct({ children, index, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
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

    // Staggered animation delay for left-to-right appearance
    const animationDelay = `${index * 0.15}s`;

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? 'animate-slideInFromLeft' : 'opacity-0'}`}
            style={{
                animationDelay: isVisible ? animationDelay : '0s',
                animationFillMode: 'forwards'
            }}
        >
            {children}
        </div>
    );
}
