'use client';

import { useState, useRef } from 'react';

export default function ImageUploader({ images, onImagesChange, maxImages = 3 }) {
    // images is an array of { file: File|null, preview: string|null, url: string|null }

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = [...images];
            // Revoke old object URL to avoid memory leaks
            if (newImages[index].preview && !newImages[index].url) {
                URL.revokeObjectURL(newImages[index].preview);
            }

            newImages[index] = {
                file: file,
                preview: URL.createObjectURL(file), // Create local preview
                url: null // Clear remote URL since we have a new local file
            };
            onImagesChange(newImages);
        }
    };

    const handleRemove = (index) => {
        const newImages = [...images];
        // Revoke old object URL
        if (newImages[index].preview && !newImages[index].url) {
            URL.revokeObjectURL(newImages[index].preview);
        }

        // Shift images left to fill the gap
        newImages.splice(index, 1);
        // Add empty slot at end
        newImages.push({ file: null, preview: null, url: null });

        onImagesChange(newImages);
    };

    // Calculate how many filled slots we have
    const filledCount = images.filter(img => img.preview || img.url).length;

    // We show slots for all filled images, plus one empty slot (if not full)
    const slotsToShow = Math.min(filledCount + 1, maxImages);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: maxImages }).map((_, index) => {
                    const image = images[index];
                    const hasImage = image?.preview || image?.url;

                    // Only show this slot if it's filled or it's the first available empty slot
                    // But actually, showing 3 fixed boxes is often better UX for specific limits
                    // Let's stick to showing all 3 boxes to make the limit obvious

                    return (
                        <div key={index} className={`relative aspect-square rounded-lg border-2 border-dashed ${hasImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                            {hasImage ? (
                                <>
                                    <img
                                        src={image.preview || image.url}
                                        alt={`Product Image ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            Main Image
                                        </span>
                                    )}
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-xs text-gray-500">Add Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, index)}
                                        disabled={index > 0 && !images[index - 1]?.preview && !images[index - 1]?.url} // Disable if previous slot empty (force sequential)
                                    />
                                </label>
                            )}
                        </div>
                    );
                })}
            </div>
            <p className="text-sm text-gray-500">
                Upload up to {maxImages} images. The first image will be the main product image.
            </p>
        </div>
    );
}
