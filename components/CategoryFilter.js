'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import styles from './CategoryFilter.module.css';

export default function CategoryFilter({ categories, locale }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentCategory = searchParams.get('category') || '';

    const handleCategoryChange = (category) => {
        const params = new URLSearchParams(searchParams);

        // Preserve existing query params like 'q' if needed, or handle exclusively
        // Usually we want to filter WITHIN search results or filter CATEGORY then SEARCH.
        // Let's preserve other params.

        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={styles.container}>
            <select
                className={styles.select}
                value={currentCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
            >
                <option value="">{locale === 'id' ? 'Semua Kategori' : 'All Categories'}</option>
                {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
