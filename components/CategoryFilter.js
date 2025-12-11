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

    // Get selected categories from URL (comma-separated)
    const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];

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

    const toggleCategory = (category) => {
        const params = new URLSearchParams(searchParams);
        let newCategories = [...selectedCategories];

        if (newCategories.includes(category)) {
            // Remove category
            newCategories = newCategories.filter(c => c !== category);
        } else {
            // Add category
            newCategories.push(category);
        }

        if (newCategories.length > 0) {
            params.set('category', newCategories.join(','));
        } else {
            params.delete('category');
        }

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearAll = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('category');
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const getLabel = () => {
        if (selectedCategories.length === 0) {
            return locale === 'id' ? 'Semua Kategori' : 'All Categories';
        } else if (selectedCategories.length === 1) {
            return categories.find(c => c.value === selectedCategories[0])?.label || '';
        } else {
            return `${selectedCategories.length} ${locale === 'id' ? 'Dipilih' : 'Selected'}`;
        }
    };

    const selectedLabel = getLabel();

    return (
        <div className={styles.container} ref={containerRef}>
            <button
                className={`${styles.trigger} ${isOpen ? styles.active : ''} ${selectedCategories.length > 0 ? styles.hasSelection : ''}`}
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
                <div className={styles.dropdown}>
                        <div className={styles.dropdownHeader}>
                            <span className={styles.dropdownTitle}>
                                {locale === 'id' ? 'Filter Kategori' : 'Filter Categories'}
                            </span>
                            {selectedCategories.length > 0 && (
                                <button className={styles.clearBtn} onClick={clearAll}>
                                    {locale === 'id' ? 'Hapus Semua' : 'Clear All'}
                                </button>
                            )}
                        </div>
                        <ul className={styles.optionList}>
                        {categories.map((cat) => (
                            <li
                                key={cat.value}
                                className={styles.checkboxOption}
                                onClick={() => toggleCategory(cat.value)}
                            >
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.value)}
                                        onChange={() => {}}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkmark}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </span>
                                    <span className={styles.optionLabel}>{cat.label}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
