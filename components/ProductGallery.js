'use client';

import { useState } from 'react';

export default function ProductGallery({ images, title }) {
    // Ensure we have at least one image/placeholder
    const validImages = images && images.length > 0 ? images : ['/placeholder.jpg'];
    const [activeImage, setActiveImage] = useState(validImages[0]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-[#f5f5f0] rounded-lg overflow-hidden relative aspect-square shadow-sm">
                <img
                    src={activeImage}
                    alt={title}
                    className="w-full h-full object-cover transition-opacity duration-300"
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
