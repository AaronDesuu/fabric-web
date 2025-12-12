'use client';

import { useState, useEffect } from 'react';

export default function ProductGallery({ images, title, activeVariantImage }) {
    // Ensure we have at least one image/placeholder
    const validImages = images && images.length > 0 ? images : ['/placeholder.jpg'];

    const [currentImage, setCurrentImage] = useState(validImages[0]);
    const [prevImage, setPrevImage] = useState(validImages[0]);
    const [animKey, setAnimKey] = useState(0);

    const handleImageChange = (newImage) => {
        if (newImage === currentImage) return;
        setPrevImage(currentImage);
        setCurrentImage(newImage);
        setAnimKey(prev => prev + 1);
    };

    useEffect(() => {
        if (activeVariantImage) {
            handleImageChange(activeVariantImage);
        }
    }, [activeVariantImage]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-[#f5f5f0] rounded-lg overflow-hidden relative aspect-square shadow-sm">
                {/* Previous Image (Background) - Prevents flashing */}
                <img
                    src={prevImage}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Current Image (Foreground) - Fades in */}
                <img
                    key={animKey}
                    src={currentImage}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover z-10 animate-fadeIn"
                />
            </div>

            {/* Thumbnails - Only show if more than 1 image */}
            {validImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {validImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${activeImage === img
                                ? 'border-primary opacity-100 ring-2 ring-primary ring-offset-1'
                                : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`${title} view ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
