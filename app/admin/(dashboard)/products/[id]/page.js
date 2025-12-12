'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { uploadImage, generateUniqueFileName, deleteImage } from '@/lib/supabase/storage';
import ImageUploader from '@/app/admin/components/ImageUploader';

const initialCategories = [
    { value: 'cotton', label: 'Cotton' },
    { value: 'silk', label: 'Silk' },
    { value: 'linen', label: 'Linen' },
    { value: 'velvet', label: 'Velvet' },
];

export default function EditProductPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [translating, setTranslating] = useState({ name: false, description: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const translationTimeoutRef = useRef({ name: null, description: null });

    // Multi-image state: Array of 3 slots
    const [productImages, setProductImages] = useState([
        { file: null, preview: null, url: null },
        { file: null, preview: null, url: null },
        { file: null, preview: null, url: null }
    ]);

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

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                setError('Product not found');
                setLoading(false);
                return;
            }

            setFormData({
                name_en: data.name_en || '',
                name_id: data.name_id || '',
                description_en: data.description_en || '',
                description_id: data.description_id || '',
                price: data.price?.toString() || '',
                category: data.category || 'cotton',
                stock_meters: data.stock_meters?.toString() || '',
                featured: data.featured || false,
                active: data.active !== false,
            });

            // If category is not in initial list, add it
            if (data.category && !initialCategories.some(c => c.value === data.category)) {
                setCategories(prev => [
                    ...prev,
                    { value: data.category, label: data.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }
                ]);
            }

            // Populate images
            // Logic: prefer image_urls (array). If empty, fallback to image_url (single).
            let currentImages = [];
            if (data.image_urls && data.image_urls.length > 0) {
                currentImages = data.image_urls;
            } else if (data.image_url) {
                currentImages = [data.image_url];
            }

            // Map to component state format (3 slots)
            const newImageState = [
                { file: null, preview: null, url: null },
                { file: null, preview: null, url: null },
                { file: null, preview: null, url: null }
            ];

            currentImages.forEach((url, index) => {
                if (index < 3) {
                    newImageState[index] = { file: null, preview: null, url: url };
                }
            });

            setProductImages(newImageState);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

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
            alert('Category already exists');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const supabase = createClient();

            const validImages = productImages.filter(img => img.file || img.url);
            let uploadedUrls = [];

            // Upload all images
            for (const img of validImages) {
                if (img.file) {
                    const fileName = generateUniqueFileName(img.file.name);
                    const path = `products/${fileName}`;
                    const { url, error: uploadError } = await uploadImage(img.file, path);

                    if (uploadError) {
                        throw new Error(`Image upload failed: ${uploadError.message}`);
                    }
                    uploadedUrls.push(url);
                } else if (img.url) {
                    uploadedUrls.push(img.url);
                }
            }

            // Update product
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
                image_urls: uploadedUrls,
            };

            const { error: updateError } = await supabase
                .from('products')
                .update(productData)
                .eq('id', id);

            if (updateError) {
                throw new Error(updateError.message);
            }

            router.push('/admin/products?success=Product updated successfully');
            router.refresh();

        } catch (err) {
            setError(err.message || 'Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        setError('');

        try {
            const supabase = createClient();

            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (deleteError) {
                throw new Error(deleteError.message);
            }

            router.push('/admin/products');
            router.refresh();

        } catch (err) {
            setError(err.message || 'Failed to delete product');
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px] text-gray-500">
                <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading product...
            </div>
        );
    }

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Edit Product
                    </h1>
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Product
                    </button>
                </div>
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
                                <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                            </div>
                            <div className="p-6">
                                <ImageUploader
                                    images={productImages}
                                    onImagesChange={setProductImages}
                                    maxImages={3}
                                />
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
                        disabled={saving}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Product?</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{formData.name_en}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
