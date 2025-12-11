import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
    const t = useTranslations('HomePage');

    return (
        <section className="h-[85vh] flex items-center justify-center text-center bg-[#1a1a1a] bg-[url('/images/hero-bg.png')] bg-cover bg-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="relative z-20 max-w-[800px] p-8 animate-fadeIn">
                <h1 className="text-4xl md:text-7xl mb-6 font-bold text-white drop-shadow-lg">{t('title')}</h1>
                <p className="text-xl md:text-3xl mb-10 text-white/90 drop-shadow-md">{t('subtitle')}</p>
                <Link href="/shop" className="btn-primary">
                    {t('cta')}
                </Link>
            </div>
        </section>
    );
}
