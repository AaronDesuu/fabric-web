import Hero from '@/components/Hero';
import { products } from '@/lib/products';
import { getTranslations } from 'next-intl/server';
import AnimatedProductCard from '@/components/AnimatedProductCard';
import AnimatedTitle from '@/components/AnimatedTitle';

export default async function Home({ params }) {
  const { locale } = await params;
  const t = await getTranslations('Home');

  const featuredProducts = products.slice(0, 3);

  return (
    <main className="bg-black">
      {/* Hero with Parallax */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 pb-24 md:pb-16 bg-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-container mx-auto px-4 relative z-10">
          <AnimatedTitle>
            <h2 className="font-heading text-4xl md:text-5xl text-center mb-4 text-white">
              {t('featuredTitle')}
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto text-lg">
              {t('featuredSubtitle')}
            </p>
          </AnimatedTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product, index) => (
              <AnimatedProductCard
                key={product.id}
                product={product}
                locale={locale}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
