'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { uploadImage, generateUniqueFileName, deleteImage } from '@/lib/supabase/storage';

const categories = [
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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState(null);

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

            if (data.image_url) {
                setImagePreview(data.image_url);
                setOriginalImageUrl(data.image_url);
            }

            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

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
        setSaving(true);

        try {
            const supabase = createClient();

            let imageUrl = originalImageUrl;

            // Upload new image if selected
            if (imageFile) {
                const fileName = generateUniqueFileName(imageFile.name);
                const path = `products/${fileName}`;
                const { url, error: uploadError } = await uploadImage(imageFile, path);

                if (uploadError) {
                    throw new Error(`Image upload failed: ${uploadError.message}`);
                }

                imageUrl = url;
            } else if (!imagePreview && originalImageUrl) {
                // Image was removed
                imageUrl = null;
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
                image_url: imageUrl,
            };

            const { error: updateError } = await supabase
                .from('products')
                .update(productData)
                .eq('id', id);

            if (updateError) {
                throw new Error(updateError.message);
            }

            setSuccess('Product updated successfully!');
            setOriginalImageUrl(imageUrl);
            setImageFile(null);

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
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                Loading product...
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <Link
                    href="/admin/products"
                    style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                    ← Back to Products
                </Link>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--admin-text)',
                    margin: '0.5rem 0 0 0'
                }}>
                    Edit Product
                </h1>
            </div>

            {error && (
                <div className="admin-alert admin-alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-alert admin-alert-success">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Left Column - Main Info */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h2 className="admin-card-title">Product Information</h2>
                        </div>
                        <div className="admin-card-body">
                            <div className="admin-form-group">
                                <label className="admin-label">Name (English) *</label>
                                <input
                                    type="text"
                                    name="name_en"
                                    value={formData.name_en}
                                    onChange={handleChange}
                                    className="admin-input"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Name (Indonesian) *</label>
                                <input
                                    type="text"
                                    name="name_id"
                                    value={formData.name_id}
                                    onChange={handleChange}
                                    className="admin-input"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Description (English)</label>
                                <textarea
                                    name="description_en"
                                    value={formData.description_en}
                                    onChange={handleChange}
                                    className="admin-input admin-textarea"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Description (Indonesian)</label>
                                <textarea
                                    name="description_id"
                                    value={formData.description_id}
                                    onChange={handleChange}
                                    className="admin-input admin-textarea"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing & Settings */}
                    <div>
                        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                            <div className="admin-card-header">
                                <h2 className="admin-card-title">Pricing & Inventory</h2>
                            </div>
                            <div className="admin-card-body">
                                <div className="admin-form-group">
                                    <label className="admin-label">Price (IDR per meter) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="admin-input"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="admin-input admin-select"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Stock (meters)</label>
                                    <input
                                        type="number"
                                        name="stock_meters"
                                        value={formData.stock_meters}
                                        onChange={handleChange}
                                        className="admin-input"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                            <div className="admin-card-header">
                                <h2 className="admin-card-title">Product Image</h2>
                            </div>
                            <div className="admin-card-body">
                                {imagePreview ? (
                                    <div className="admin-image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="admin-image-remove"
                                            onClick={removeImage}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <label className="admin-image-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                        <div style={{ color: 'var(--admin-text-muted)' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>📷</div>
                                            <div>Click to upload image</div>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2 className="admin-card-title">Status</h2>
                            </div>
                            <div className="admin-card-body">
                                <div className="admin-form-group">
                                    <label className="admin-checkbox-group">
                                        <input
                                            type="checkbox"
                                            name="active"
                                            checked={formData.active}
                                            onChange={handleChange}
                                            className="admin-checkbox"
                                        />
                                        <span>Active (visible on store)</span>
                                    </label>
                                </div>
                                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-checkbox-group">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                            className="admin-checkbox"
                                        />
                                        <span>Featured (show on homepage)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1.5rem',
                    justifyContent: 'space-between'
                }}>
                    <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Delete Product
                    </button>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href="/admin/products" className="admin-btn admin-btn-secondary">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50
                }}>
                    <div className="admin-card" style={{ maxWidth: 400, width: '100%', margin: '1rem' }}>
                        <div className="admin-card-header">
                            <h2 className="admin-card-title">Delete Product?</h2>
                        </div>
                        <div className="admin-card-body">
                            <p style={{ marginBottom: '1.5rem', color: 'var(--admin-text)' }}>
                                Are you sure you want to delete <strong>{formData.name_en}</strong>?
                                This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="admin-btn admin-btn-danger"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
