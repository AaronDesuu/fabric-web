import AddToCart from '@/components/AddToCart';
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import styles from './ProductDetail.module.css';

export async function generateStaticParams() {
    const locales = ['en', 'id'];
    const params = [];

    for (const locale of locales) {
        for (const product of products) {
            params.push({
                locale: locale,
                slug: product.id
            });
        }
    }

    return params;
}

export default async function ProductPage({ params }) {
    const { slug, locale } = await params;
    const product = products.find((p) => p.id === slug);

    if (!product) {
        notFound();
    }

    // We need to use 'useTranslations' in a Client Component or use 'getTranslations' in Server Component?
    // Since we are traversing dictionaries, let's just cheat a bit and access locale directly for data
    // but for static UI text we might need to be careful.
    // Although `useTranslations` works in Server Components effectively for static rendering if setup right,
    // let's grab the dictionary manually if needed or stick to passed locale for content.
    // Actually, next-intl supports Server Components.

    // NOTE: In a real app we would use `getTranslations`
    const tProduct = {
        addToCart: locale === 'id' ? 'Tambah ke Keranjang' : 'Add to Cart',
        description: locale === 'id' ? 'Deskripsi' : 'Description'
    };

    const price = new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency: 'IDR'
    }).format(product.price);

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img src={product.image} alt={product.name[locale]} className={styles.image} />
            </div>
            <div className={styles.info}>
                <h1 className={styles.title}>{product.name[locale]}</h1>
                <div className={styles.price}>
                    {price} <span className={styles.unit}>/ meter</span>
                </div>

                <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.25rem', color: 'var(--color-secondary)' }}>
                        {locale === 'id' ? 'Lebar' : 'Width'}: {product.width}m
                    </h3>
                    <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', marginTop: '1.5rem' }}>{tProduct.description}</h3>
                    <p className={styles.description}>{product.description[locale]}</p>
                </div>

                <div className={styles.actions}>
                    <AddToCart product={product} label={tProduct.addToCart} />
                </div>
            </div>
        </div>
    );
}
