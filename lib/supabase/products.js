/**
 * Product database operations using Supabase
 */

import { createClient } from './server';

/**
 * Get all active products
 * @param {Object} options - Query options
 * @param {string} options.category - Filter by category (optional)
 * @param {boolean} options.featuredOnly - Get only featured products (optional)
 * @returns {Promise<Array>} Array of products
 */
export async function getProducts({ category = null, featuredOnly = false } = {}) {
    const supabase = await createClient();

    let query = supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

    if (category) {
        query = query.eq('category', category);
    }

    if (featuredOnly) {
        query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    // Transform data to match the current product structure
    return data.map(product => ({
        id: product.id,
        name: {
            en: product.name_en,
            id: product.name_id
        },
        description: {
            en: product.description_en || '',
            id: product.description_id || ''
        },
        price: parseFloat(product.price),
        category: product.category,
        image: product.image_url,
        width: parseFloat(product.width_meters || 1.25),
        stock: parseFloat(product.stock_meters || 0),
        featured: product.featured
    }));
}

/**
 * Get a single product by ID
 * @param {string} id - Product UUID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export async function getProductById(id) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    if (!data) return null;

    // Transform data to match the current product structure
    return {
        id: data.id,
        name: {
            en: data.name_en,
            id: data.name_id
        },
        description: {
            en: data.description_en || '',
            id: data.description_id || ''
        },
        price: parseFloat(data.price),
        category: data.category,
        image: data.image_url,
        width: parseFloat(data.width_meters || 1.25),
        stock: parseFloat(data.stock_meters || 0),
        featured: data.featured
    };
}

/**
 * Get all unique categories
 * @returns {Promise<Array>} Array of category strings
 */
export async function getCategories() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('active', true);

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Get unique categories
    const categories = [...new Set(data.map(p => p.category))];
    return categories.filter(Boolean); // Remove null/undefined
}

/**
 * Search products by name
 * @param {string} searchTerm - Search term
 * @param {string} locale - Language locale ('en' or 'id')
 * @returns {Promise<Array>} Array of matching products
 */
export async function searchProducts(searchTerm, locale = 'en') {
    const supabase = await createClient();

    const columnName = locale === 'id' ? 'name_id' : 'name_en';

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .ilike(columnName, `%${searchTerm}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching products:', error);
        return [];
    }

    // Transform data
    return data.map(product => ({
        id: product.id,
        name: {
            en: product.name_en,
            id: product.name_id
        },
        description: {
            en: product.description_en || '',
            id: product.description_id || ''
        },
        price: parseFloat(product.price),
        category: product.category,
        image: product.image_url,
        width: parseFloat(product.width_meters || 1.25),
        stock: parseFloat(product.stock_meters || 0),
        featured: product.featured
    }));
}
