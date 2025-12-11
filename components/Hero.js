import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Hero.module.css';

export default function Hero() {
    const t = useTranslations('HomePage');

    return (
        <section className={styles.hero}>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                <Link href="/shop" className="btn-primary">
                    {t('cta')}
                </Link>
            </div>
        </section>
    );
}
