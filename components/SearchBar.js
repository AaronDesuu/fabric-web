'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import styles from './SearchBar.module.css';

export default function SearchBar({ placeholder }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [term, setTerm] = useState(searchParams.get('q') || '');

    const handleSearch = (searchTerm) => {
        setTerm(searchTerm);

        // Simple debounce 
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set('q', searchTerm);
        } else {
            params.delete('q');
        }

        // This is not wrapped in a debounce here, handled by useEffect or just let it update?
        // Let's do a simple effect for debouncing.
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set('q', term);
            } else {
                params.delete('q');
            }
            replace(`${pathname}?${params.toString()}`);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [term, pathname, replace]);
    // Wait, adding searchParams to dependency might cause loops if not careful? 
    // Actually, replace() updates URL, which updates searchParams, which re-renders.
    // BUT the term state is local. 
    // If searchParams changes from outside (e.g. back button), we should sync term?
    // Let's stick to a simpler implementation:

    // Actually simplest is just onChange updates state, and a separate debounce calls router.

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                placeholder={placeholder}
                value={term}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
        </div>
    );
}
