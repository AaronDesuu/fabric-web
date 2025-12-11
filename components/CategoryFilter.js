'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import styles from './CategoryFilter.module.css';

export default function CategoryFilter({ categories, locale }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const currentCategory = searchParams.get('category') || '';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCategoryChange = (category) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        replace(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    const selectedLabel = categories.find(c => c.value === currentCategory)?.label || (locale === 'id' ? 'Semua Kategori' : 'All Categories');

    return (
        <div className={styles.container} ref={containerRef}>
            <button
                className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={styles.iconWrapper}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                </span>
                <span className={styles.labelText}>{selectedLabel}</span>
                <span className={styles.arrow} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>

            {isOpen && (
                <ul className={styles.dropdown} role="listbox">
                    <li
                        className={`${styles.option} ${currentCategory === '' ? styles.selected : ''}`}
                        onClick={() => handleCategoryChange('')}
                        role="option"
                        aria-selected={currentCategory === ''}
                    >
                        {locale === 'id' ? 'Semua Kategori' : 'All Categories'}
                    </li>
                    {categories.map((cat) => (
                        <li
                            key={cat.value}
                            className={`${styles.option} ${currentCategory === cat.value ? styles.selected : ''}`}
                            onClick={() => handleCategoryChange(cat.value)}
                            role="option"
                            aria-selected={currentCategory === cat.value}
                        >
                            {cat.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
