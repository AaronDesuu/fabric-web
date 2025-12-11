'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ locale }) {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const router = useRouter();
    const { setIsOpen, cart } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const switchLocale = () => {
        const newLocale = locale === 'en' ? 'id' : 'en';
        router.replace(pathname, { locale: newLocale });
    };

    const totalItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    {/* Hamburger Button (Mobile Only) */}
                    <button
                        className={styles.hamburger}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    <Link href="/" className={styles.logo}>Scorpio</Link>
                </div>

                {/* Desktop Links */}
                <div className={styles.desktopLinks}>
                    <Link href="/shop" className={styles.link}>{t('shop')}</Link>
                    <Link href="/contact" className={styles.link}>{t('contact')}</Link>
                </div>

                <div className={styles.rightSection}>
                    {/* Simplified Language Switcher */}
                    <button
                        onClick={switchLocale}
                        className={styles.langSwitch}
                        title={locale === 'id' ? 'Change to English' : 'Ubah ke Bahasa Indonesia'}
                    >
                        {locale.toUpperCase()}
                    </button>

                    <button
                        onClick={() => setIsOpen(true)}
                        className={styles.cartButton}
                        aria-label="Cart"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.drawerOverlay} onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className={styles.drawerContent}>
                    <button
                        className={styles.closeButton}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className={styles.drawerLinks}>
                        <Link href="/" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>{t('home')}</Link>
                        <Link href="/shop" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>{t('shop')}</Link>
                        <Link href="/contact" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>{t('contact')}</Link>
                    </div>

                    <div className={styles.drawerFooter}>
                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Scorpio Textiles</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
