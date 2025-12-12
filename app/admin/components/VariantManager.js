'use client';

import { useState, useRef, useEffect } from 'react';
import { translateText } from '@/lib/utils/translate';

export default function VariantManager({ variants = [], onVariantsChange }) {
    // variants structure: [{ id: uuid (optional), variant_name: 'Color', variant_value_en: 'Red', variant_value_id: 'Merah', stock_meters: 10, variant_image: 'url', imageFile: File }]

    // Quick-add state
    const [newItem, setNewItem] = useState({
        en: '',
        id: '',
        stock: '',
        imageFile: null,
        imagePreview: null
    });

    // Translation state
    const [translating, setTranslating] = useState(false);
    const translationTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);
            // Cleanup previews
            if (newItem.imagePreview) URL.revokeObjectURL(newItem.imagePreview);
            variants.forEach(v => {
                if (v.imagePreview) URL.revokeObjectURL(v.imagePreview);
            });
        };
    }, []);

    const handleIndonesianChange = (val) => {
        setNewItem(prev => ({ ...prev, id: val }));

        if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);

        if (val.trim()) {
            translationTimeoutRef.current = setTimeout(async () => {
                setTranslating(true);
                const translated = await translateText(val, 'id', 'en');
                if (translated) {
                    setNewItem(prev => ({ ...prev, en: translated }));
                }
                setTranslating(false);
            }, 1000);
        }
    };

    const handleManualTranslate = async () => {
        if (!newItem.id.trim()) return;
        setTranslating(true);
        const translated = await translateText(newItem.id, 'id', 'en');
        if (translated) {
            setNewItem(prev => ({ ...prev, en: translated }));
        }
        setTranslating(false);
    };

    const handleFileChange = (e, isNew = false, index = -1) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);

        if (isNew) {
            if (newItem.imagePreview) URL.revokeObjectURL(newItem.imagePreview);
            setNewItem(prev => ({ ...prev, imageFile: file, imagePreview: preview }));
        } else {
            const newVariants = [...variants];
            // Cleanup old preview if strictly a preview and not a persistent URL
            if (newVariants[index].imagePreview) URL.revokeObjectURL(newVariants[index].imagePreview);

            newVariants[index] = {
                ...newVariants[index],
                imageFile: file,
                imagePreview: preview
            };
            onVariantsChange(newVariants);
        }
    };

    const handleAdd = () => {
        if (!newItem.id.trim() && !newItem.en.trim()) return;

        // Use whatever is available if one is missing (fallback)
        const valEn = newItem.en.trim() || newItem.id.trim();
        const valId = newItem.id.trim() || newItem.en.trim();

        const newVariant = {
            // Temporary ID for key until saved
            tempId: Date.now(),
            variant_name: 'Color',
            variant_value_en: valEn,
            variant_value_id: valId,
            stock_meters: parseFloat(newItem.stock) || 0,
            imageFile: newItem.imageFile,
            imagePreview: newItem.imagePreview,
            variant_image: null // Will be set after upload in parent
        };

        onVariantsChange([...variants, newVariant]);
        setNewItem({ en: '', id: '', stock: '', imageFile: null, imagePreview: null });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemove = (index) => {
        const newVariants = [...variants];
        if (newVariants[index].imagePreview) URL.revokeObjectURL(newVariants[index].imagePreview);
        newVariants.splice(index, 1);
        onVariantsChange(newVariants);
    };

    const handleUpdate = (index, field, val) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: val };
        onVariantsChange(newVariants);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                    Colors, Images & Stock (Indonesian / English)
                </label>
                <p className="text-xs text-gray-500">
                    Add available colors and optional images per color.
                </p>
            </div>

            {/* List of existing variants */}
            <div className="space-y-2">
                {variants.map((variant, index) => {
                    // Backwards compatibility for existing data
                    const valEn = variant.variant_value_en || variant.variant_value || '';
                    const valId = variant.variant_value_id || variant.variant_value || '';
                    const imgSrc = variant.imagePreview || variant.variant_image;

                    return (
                        <div key={variant.id || variant.tempId || index} className="grid grid-cols-1 md:grid-cols-[40px_1fr_1fr_100px_auto] gap-2 items-center bg-gray-50 p-2 rounded-md">
                            {/* Image Upload for Row */}
                            <div className="relative group w-10 h-10 bg-white border border-gray-200 rounded-md overflow-hidden flex items-center justify-center cursor-pointer">
                                {imgSrc ? (
                                    <img src={imgSrc} alt="Variant" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(e, false, index)}
                                    title="Change image"
                                />
                            </div>

                            {/* Indonesian Input */}
                            <div>
                                <input
                                    type="text"
                                    value={valId}
                                    onChange={(e) => handleUpdate(index, 'variant_value_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    placeholder="Warna (ID)"
                                />
                            </div>

                            {/* English Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={valEn}
                                    onChange={(e) => handleUpdate(index, 'variant_value_en', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    placeholder="Color (EN)"
                                />
                            </div>

                            {/* Stock Input */}
                            <div className="relative">
                                <input
                                    type="number"
                                    value={variant.stock_meters}
                                    onChange={(e) => handleUpdate(index, 'stock_meters', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    placeholder="Stock"
                                    min="0"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                title="Remove variant"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Add New Row */}
            <div className="grid grid-cols-1 md:grid-cols-[40px_1fr_1fr_100px_auto] gap-2 items-center bg-blue-50 p-3 rounded-lg border border-dashed border-blue-300">
                {/* New Image */}
                <div className="relative group w-10 h-10 bg-white border border-blue-300 rounded-md overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-500">
                    {newItem.imagePreview ? (
                        <img src={newItem.imagePreview} alt="New" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e, true)}
                        title="Upload image"
                    />
                </div>

                {/* ID Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={newItem.id}
                        onChange={(e) => handleIndonesianChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Warna (ID)"
                        autoFocus
                    />
                    {translating && (
                        <div className="absolute right-2 top-2">
                            <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>

                {/* EN Input */}
                <div className="flex gap-1">
                    <input
                        type="text"
                        value={newItem.en}
                        onChange={(e) => setNewItem(prev => ({ ...prev, en: e.target.value }))}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Color (EN)"
                    />
                </div>

                {/* Stock */}
                <div>
                    <input
                        type="number"
                        value={newItem.stock}
                        onChange={(e) => setNewItem(prev => ({ ...prev, stock: e.target.value }))}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Stock (m)"
                        min="0"
                    />
                </div>

                {/* Add Button */}
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!newItem.id && !newItem.en}
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {variants.length > 0 && (
                <div className="text-right text-sm text-gray-500">
                    Total Variants Stock: <span className="font-semibold text-gray-900">{variants.reduce((sum, v) => sum + (parseFloat(v.stock_meters) || 0), 0)}m</span>
                </div>
            )}
        </div>
    );
}
