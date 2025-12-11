'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';


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
        <div className="relative w-fit" ref={containerRef}>
            <button
                className={`flex items-center gap-2 py-3 px-4 bg-white border border-[#e5e5e5] rounded-md text-[0.95rem] cursor-pointer transition-all text-gray-900 hover:border-[#bbb] hover:bg-[#fafafa] md:w-auto md:h-auto md:justify-start w-[42px] h-[42px] justify-center p-3 md:py-3 md:px-4 ${isOpen ? 'border-primary ring-2 ring-primary/10' : ''} ${selectedCategories.length > 0 ? 'bg-[#fff5f5] border-primary' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`flex items-center ${isOpen || selectedCategories.length > 0 ? 'text-primary' : 'text-[#666]'} md:text-[#666]`}>
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
                <span className="font-medium whitespace-nowrap hidden md:block">{selectedLabel}</span>
                <span className="hidden md:flex items-center text-[#999] transition-transform ml-2" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%_+_0.5rem)] right-0 min-w-[240px] bg-white border border-[#eee] rounded-lg shadow-lg z-50 animate-fadeIn md:right-0 md:left-auto md:w-auto md:max-w-none fixed left-4 right-4 top-auto w-auto max-w-none md:absolute">
                    <div className="flex justify-between items-center p-3.5 px-4 border-b border-[#f0f0f0]">
                        <span className="font-semibold text-sm text-secondary uppercase tracking-wide">
                            {locale === 'id' ? 'Filter Kategori' : 'Filter Categories'}
                        </span>
                        {selectedCategories.length > 0 && (
                            <button className="bg-transparent border-none text-primary text-sm font-semibold cursor-pointer px-2 py-1 rounded hover:bg-[#fff5f5] transition-colors" onClick={clearAll}>
                                {locale === 'id' ? 'Hapus Semua' : 'Clear All'}
                            </button>
                        )}
                    </div>
                    <ul className="list-none p-2 m-0 max-h-[300px] overflow-y-auto">
                        {categories.map((cat) => (
                            <li
                                key={cat.value}
                                className="p-0 m-0 cursor-pointer"
                                onClick={() => toggleCategory(cat.value)}
                            >
                                <label className="flex items-center gap-3 p-3 px-3.5 rounded-md cursor-pointer transition-colors relative hover:bg-gray-50 group">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.value)}
                                        onChange={() => { }}
                                        className="absolute opacity-0 w-0 h-0 peer"
                                    />
                                    <span className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center bg-white transition-all shrink-0 peer-checked:bg-primary peer-checked:border-primary">
                                        <svg className="opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100 stroke-white" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </span>
                                    <span className="text-[0.95rem] text-[#444] font-medium select-none peer-checked:text-secondary peer-checked:font-semibold">{cat.label}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
