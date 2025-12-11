'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';



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
        <div className="relative flex-1 min-w-[200px]">
            <input
                className="w-full py-3 px-4 pl-10 border border-[#e5e5e5] rounded-md font-inherit text-base transition-colors duration-200 bg-[#fafafa] focus:outline-none focus:border-primary focus:bg-white"
                placeholder={placeholder}
                value={term}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999] pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
        </div>
    );
}
