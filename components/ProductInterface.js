'use client';

import { useState } from 'react';
import ProductGallery from './ProductGallery';
import AddToCart from './AddToCart';

export default function ProductInterface({ product, locale, tProduct, variants = [] }) {
    const [selectedVariant, setSelectedVariant] = useState(variants.length > 0 ? variants[0] : null);

    // Determine which image to show
    // If a variant is selected and has an image, use it.
    // Otherwise rely on ProductGallery's internal state (controlled via key or prop?)
    // Actually, ProductGallery handles its own state (activeIndex). 
    // We should pass an "activeImage" prop that overrides internal state if present?
    // Or just pass the image list, but "activeImage" is better for "switch to this one".

    const activeImage = selectedVariant?.variant_image;

    return (
        <div className="max-w-container mx-auto py-8 md:py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            <ProductGallery
                images={product.images}
                title={product.name[locale]}
                activeVariantImage={activeImage}
            />
            <div className="flex flex-col gap-6">
                <h1 className="font-heading text-5xl text-primary">{product.name[locale]}</h1>
                <div className="text-3xl font-semibold text-secondary">
                    {new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR' }).format(product.price)} <span className="text-base font-normal text-gray-500">/ meter</span>
                </div>

                <div>
                    <h3 className="font-heading mb-4 text-secondary">
                        {locale === 'id' ? 'Lebar' : 'Width'}: {product.width}m
                    </h3>

                    <div className="mb-8 flex gap-4">
                        <AddToCart
                            product={product}
                            label={tProduct.addToCart}
                            locale={locale}
                            variants={variants}
                            selectedVariant={selectedVariant}
                            onSelectVariant={setSelectedVariant}
                        />
                    </div>

                    <h3 className="font-heading mb-2 mt-6 text-xl text-primary">{tProduct.description}</h3>
                    <p className="text-[1.1rem] text-[#555] leading-relaxed">{product.description[locale]}</p>
                </div>
            </div>
        </div >
    );
}
