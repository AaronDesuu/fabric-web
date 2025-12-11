'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ParallaxSection from './ParallaxSection';
import { useState, useEffect } from 'react';

export default function Hero() {
    const t = useTranslations('Hero');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax */}
                <ParallaxSection speed={-0.5} className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(/images/hero-bg.png)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
                </ParallaxSection>

                {/* Content with layered parallax */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <ParallaxSection speed={-0.2}>
                        <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.2s' }}>
                            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                                {t('title')}
                            </h1>
                        </div>
                    </ParallaxSection>

                    <ParallaxSection speed={-0.15}>
                        <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.5s' }}>
                            <p className="text-xl md:text-2xl text-white/95 mb-8 font-light tracking-wide drop-shadow-lg">
                                {t('subtitle')}
                            </p>
                        </div>
                    </ParallaxSection>

                    <ParallaxSection speed={-0.1}>
                        <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.8s' }}>
                            <div className={`transition-opacity duration-500 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <Link
                                    href="/shop"
                                    className="inline-block bg-primary text-white px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-all duration-500 hover:bg-[#5c1313] hover:scale-105 hover:shadow-2xl shadow-xl"
                                >
                                    {t('cta')}
                                </Link>
                            </div>
                        </div>
                    </ParallaxSection>
                </div>
            </section>

            {/* Sticky button when scrolled - with smooth fade-in */}
            <Link
                href="/shop"
                className={`fixed top-[73px] right-4 z-[90] bg-primary text-white text-sm px-6 py-3 rounded-md font-semibold uppercase tracking-wider hover:bg-[#5c1313] hover:scale-105 shadow-xl transition-all duration-500 ${
                    isScrolled
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                {t('cta')}
            </Link>
        </>
    );
}
