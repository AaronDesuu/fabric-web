import AddToCart from '@/components/AddToCart';
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';


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
        <div className="max-w-container mx-auto py-8 md:py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div className="bg-[#f5f5f0] rounded-lg overflow-hidden relative aspect-square">
                <img src={product.image} alt={product.name[locale]} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-6">
                <h1 className="font-heading text-5xl text-primary">{product.name[locale]}</h1>
                <div className="text-3xl font-semibold text-secondary">
                    {price} <span className="text-base font-normal text-gray-500">/ meter</span>
                </div>

                <div>
                    <h3 className="font-heading mb-1 text-secondary">
                        {locale === 'id' ? 'Lebar' : 'Width'}: {product.width}m
                    </h3>
                    <h3 className="font-heading mb-2 mt-6 text-xl text-primary">{tProduct.description}</h3>
                    <p className="text-[1.1rem] text-[#555] leading-relaxed">{product.description[locale]}</p>
                </div>

                <div className="mt-8 flex gap-4">
                    <AddToCart product={product} label={tProduct.addToCart} />
                </div>
            </div>
        </div >
    );
}
