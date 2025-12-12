'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar({ locale }) {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const router = useRouter();
    const { setIsOpen, cart } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const switchLocale = () => {
        const newLocale = locale === 'en' ? 'id' : 'en';
        router.replace(pathname, { locale: newLocale, scroll: false });
    };

    const totalItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <nav className="sticky top-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-black/5 shadow-sm">
                <div className="max-w-container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Button (Mobile Only) */}
                        <button
                            className="flex md:hidden bg-transparent border-none cursor-pointer text-gray-900 p-0"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open Menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            {/* Scorpion Icon */}
                            <img
                                src="/images/scorpion.png"
                                alt="Scorpio"
                                className="h-7 w-7 transition-transform group-hover:scale-110"
                            />

                            <span className="font-heading text-2xl font-bold text-primary tracking-wide">
                                SCORPIO
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-8 items-center">
                        <Link href="/shop" className="font-medium text-gray-900 text-sm transition-colors duration-200 hover:text-primary">{t('shop')}</Link>
                        <Link href="/payment-delivery" className="font-medium text-gray-900 text-sm transition-colors duration-200 hover:text-primary">{t('paymentDelivery')}</Link>
                        <Link href="/contact" className="font-medium text-gray-900 text-sm transition-colors duration-200 hover:text-primary">{t('contact')}</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Simplified Language Switcher */}
                        <button
                            onClick={switchLocale}
                            className="bg-transparent border border-gray-200 px-2 py-1 rounded text-xs font-semibold cursor-pointer text-gray-900 transition-all duration-200 hover:bg-primary hover:border-primary hover:text-white"
                            title={locale === 'id' ? 'Change to English' : 'Ubah ke Bahasa Indonesia'}
                        >
                            {locale.toUpperCase()}
                        </button>

                        <button
                            onClick={() => setIsOpen(true)}
                            className="relative bg-transparent border-none cursor-pointer text-gray-900 p-0 flex items-center"
                            aria-label="Cart"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-[18px] h-[18px] rounded-full flex justify-center items-center font-semibold">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
            </nav>

            {/* Mobile Navigation Drawer - Moved outside nav to avoid backdrop-filter containing block issues */}
            <div
                className={`fixed inset-0 z-[200] transition-visibility duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
                aria-hidden={!isMobileMenuOpen}
            >
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>

                {/* Drawer Content */}
                <div
                    className={`absolute top-0 left-0 w-[280px] h-full bg-white shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                        <span className="font-heading text-xl text-primary font-bold uppercase tracking-wider">Scorpio</span>
                        <button
                            className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-primary transition-colors p-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close Menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link href="/" className="text-lg font-medium text-gray-800 py-3 px-2 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t('home')}</Link>
                        <Link href="/shop" className="text-lg font-medium text-gray-800 py-3 px-2 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t('shop')}</Link>
                        <Link href="/payment-delivery" className="text-lg font-medium text-gray-800 py-3 px-2 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t('paymentDelivery')}</Link>
                        <Link href="/contact" className="text-lg font-medium text-gray-800 py-3 px-2 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t('contact')}</Link>
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-6">
                        <p className="text-xs text-gray-400 text-center">© 2024 Scorpio Textiles</p>
                    </div>
                </div>
            </div>
        </>
    );
}
