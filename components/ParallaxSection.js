'use client';

import { useEffect, useState } from 'react';

export default function ParallaxSection({ children, speed = 0.5, className = '' }) {
    const [offsetY, setOffsetY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile on mount
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleScroll = () => {
            setOffsetY(window.pageYOffset);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    return (
        <div
            className={className}
            style={{
                // Disable parallax on mobile to prevent scroll issues
                transform: isMobile ? 'none' : `translateY(${offsetY * speed}px)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            {children}
        </div>
    );
}
