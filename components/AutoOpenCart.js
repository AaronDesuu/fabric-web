'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function AutoOpenCart() {
    const { setIsOpen } = useCart();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const hasOpened = useRef(false);

    useEffect(() => {
        if (searchParams.get('openCart') === 'true' && !hasOpened.current) {
            setIsOpen(true);
            hasOpened.current = true;

            // Clean up the URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete('openCart');

            // Use replace to update URL without adding to history stack
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [searchParams, setIsOpen, router, pathname]);

    return null;
}
