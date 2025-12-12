'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { uploadImage, generateUniqueFileName } from '@/lib/supabase/storage';

const initialCategories = [
    { value: 'cotton', label: 'Cotton' },
    { value: 'silk', label: 'Silk' },
    { value: 'linen', label: 'Linen' },
    { value: 'velvet', label: 'Velvet' },
];

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [translating, setTranslating] = useState({ name: false, description: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const translationTimeoutRef = useRef({ name: null, description: null });

    const [categories, setCategories] = useState(initialCategories);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const [formData, setFormData] = useState({
        name_en: '',
        name_id: '',
        description_en: '',
        description_id: '',
        price: '',
        category: 'cotton',
        stock_meters: '',
        featured: false,
        active: true,
    });

    // Auto-translate function using Google Translate API (free tier)
    const translateText = async (text, field) => {
        if (!text || text.trim() === '') return '';

        try {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await response.json();
            return data[0][0][0];
        } catch (err) {
            console.error('Translation error:', err);
            return '';
        }
    };

    // Handle Indonesian input changes with auto-translation
    const handleIndonesianChange = async (e, field) => {
        const { value } = e.target;
        const idField = field === 'name' ? 'name_id' : 'description_id';
        const enField = field === 'name' ? 'name_en' : 'description_en';

        // Update Indonesian field immediately
        setFormData(prev => ({
            ...prev,
            [idField]: value
        }));

        // Clear existing timeout
        if (translationTimeoutRef.current[field]) {
            clearTimeout(translationTimeoutRef.current[field]);
        }

        // Set new timeout for auto-translation (1 second after user stops typing)
        if (value.trim()) {
            translationTimeoutRef.current[field] = setTimeout(async () => {
                setTranslating(prev => ({ ...prev, [field]: true }));
                const translated = await translateText(value, field);
                if (translated) {
                    setFormData(prev => ({
                        ...prev,
                        [enField]: translated
                    }));
                }
                setTranslating(prev => ({ ...prev, [field]: false }));
            }, 1000);
        }
    };

    // Manual translation button handler
    const handleManualTranslate = async (field) => {
        const idField = field === 'name' ? 'name_id' : 'description_id';
        const enField = field === 'name' ? 'name_en' : 'description_en';

        if (!formData[idField] || formData[idField].trim() === '') return;

        setTranslating(prev => ({ ...prev, [field]: true }));
        const translated = await translateText(formData[idField], field);
        if (translated) {
            setFormData(prev => ({
                ...prev,
                [enField]: translated
            }));
        }
        setTranslating(prev => ({ ...prev, [field]: false }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // If selecting "add_new" in category dropdown, show input
        if (name === 'category' && value === 'add_new') {
            setShowNewCategoryInput(true);
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle adding a new category
    const handleAddCategory = () => {
        if (!newCategory || newCategory.trim() === '') return;

        const categoryValue = newCategory.toLowerCase().replace(/\s+/g, '_');
        const categoryLabel = newCategory.trim();

        // Check if category already exists
        if (categories.some(cat => cat.value === categoryValue)) {
            setError('Category already exists');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Add new category to the list
        const newCat = { value: categoryValue, label: categoryLabel };
        setCategories(prev => [...prev, newCat]);

        // Set as selected category
        setFormData(prev => ({
            ...prev,
            category: categoryValue
        }));

        // Reset
        setNewCategory('');
        setShowNewCategoryInput(false);
    };

    // Cancel adding new category
    const handleCancelNewCategory = () => {
        setNewCategory('');
        setShowNewCategoryInput(false);
        // Reset to first category if no category was selected
        if (!formData.category || formData.category === 'add_new') {
            setFormData(prev => ({
                ...prev,
                category: categories[0].value
            }));
        }
    };

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (translationTimeoutRef.current.name) {
                clearTimeout(translationTimeoutRef.current.name);
            }
            if (translationTimeoutRef.current.description) {
                clearTimeout(translationTimeoutRef.current.description);
            }
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const supabase = createClient();

            let imageUrl = null;

            // Upload image if selected
            if (imageFile) {
                const fileName = generateUniqueFileName(imageFile.name);
                const path = `products/${fileName}`;
                const { url, error: uploadError } = await uploadImage(imageFile, path);

                if (uploadError) {
                    throw new Error(`Image upload failed: ${uploadError.message}`);
                }

                imageUrl = url;
            }

            // Insert product
            const productData = {
                name_en: formData.name_en,
                name_id: formData.name_id,
                description_en: formData.description_en || null,
                description_id: formData.description_id || null,
                price: parseFloat(formData.price) || 0,
                category: formData.category,
                stock_meters: parseFloat(formData.stock_meters) || 0,
                featured: formData.featured,
                active: formData.active,
                image_url: imageUrl,
            };

            const { data, error: insertError } = await supabase
                .from('products')
                .insert(productData)
                .select()
                .single();

            if (insertError) {
                throw new Error(insertError.message);
            }

            setSuccess('Product created successfully!');

            // Redirect to products list after short delay
            setTimeout(() => {
                router.push('/admin/products');
                router.refresh();
            }, 1000);

        } catch (err) {
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    Add New Product
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-600">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name (Indonesian) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name_id"
                                        value={formData.name_id}
                                        onChange={(e) => handleIndonesianChange(e, 'name')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Sutra Merah Premium"
                                        required
                                    />
                                    {translating.name && (
                                        <div className="absolute right-3 top-2.5">
                                            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Auto-translates to English after you stop typing</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name (English) *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleManualTranslate('name')}
                                        disabled={!formData.name_id || translating.name}
                                        className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                        Translate
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    name="name_en"
                                    value={formData.name_en}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                    placeholder="e.g., Premium Red Silk"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Indonesian)
                                </label>
                                <div className="relative">
                                    <textarea
                                        name="description_id"
                                        value={formData.description_id}
                                        onChange={(e) => handleIndonesianChange(e, 'description')}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Deskripsi produk dalam Bahasa Indonesia..."
                                    />
                                    {translating.description && (
                                        <div className="absolute right-3 top-2.5">
                                            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Auto-translates to English after you stop typing</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description (English)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleManualTranslate('description')}
                                        disabled={!formData.description_id || translating.description}
                                        className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                        Translate
                                    </button>
                                </div>
                                <textarea
                                    name="description_en"
                                    value={formData.description_en}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                    placeholder="Product description in English..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing & Settings */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (IDR per meter) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 150000"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    {showNewCategoryInput ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter new category name"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleAddCategory}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Add Category
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelNewCategory}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                            <option value="add_new" className="text-blue-600 font-medium">
                                                + Add New Category
                                            </option>
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock (meters)
                                    </label>
                                    <input
                                        type="number"
                                        name="stock_meters"
                                        value={formData.stock_meters}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 100"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Product Image</h2>
                            </div>
                            <div className="p-6">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div className="text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="text-sm">Click to upload image</div>
                                            <div className="text-xs mt-1">PNG, JPG up to 5MB</div>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Status</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active (visible on store)</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Featured (show on homepage)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
