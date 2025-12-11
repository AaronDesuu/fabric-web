'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, locale }) {
    const t = useTranslations('Product');

    // Format price in IDR
    const price = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(product.price);

    return (
        <div className={styles.card} title={`${product.name[locale]} - ${price}`}>
            <Link href={`/shop/${product.id}`} className={styles.imageWrapper}>
                <img src={product.image} alt={product.name[locale]} className={styles.image} />
                <div className={styles.overlay}>
                    <span className={styles.overlayName}>{product.name[locale]}</span>
                    <span className={styles.overlayPrice}>{price} / m</span>
                </div>
            </Link>
            <div className={styles.info}>
                <Link href={`/shop/${product.id}`}>
                    <h3 className={styles.name}>{product.name[locale]}</h3>
                </Link>
                <p className={styles.price}>
                    {price} <span className={styles.unit}>{t('perMeter')}</span>
                </p>
                <button className={styles.button}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
