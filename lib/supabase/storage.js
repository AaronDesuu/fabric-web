/**
 * Supabase Storage helper functions for managing product images
 */

import { createClient } from './client';

const BUCKET_NAME = 'product-images';

/**
 * Get public URL for an image in storage
 * @param {string} imagePath - Path to image in bucket (e.g., 'products/silk-chiffon.jpg')
 * @returns {string} Public URL for the image
 */
export function getImageUrl(imagePath) {
    if (!imagePath) return null;

    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    const supabase = createClient();
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(imagePath);

    return data.publicUrl;
}

/**
 * Upload an image to Supabase Storage
 * @param {File} file - File object from input
 * @param {string} path - Path where to store the file (e.g., 'products/my-image.jpg')
 * @returns {Promise<{url: string, path: string, error: any}>}
 */
export async function uploadImage(file, path) {
    const supabase = createClient();

    // Upload file
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false // Don't overwrite existing files
        });

    if (error) {
        return { url: null, path: null, error };
    }

    // Get public URL
    const url = getImageUrl(data.path);

    return { url, path: data.path, error: null };
}

/**
 * Delete an image from Supabase Storage
 * @param {string} path - Path to the file to delete
 * @returns {Promise<{success: boolean, error: any}>}
 */
export async function deleteImage(path) {
    const supabase = createClient();

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
        return { success: false, error };
    }

    return { success: true, error: null };
}

/**
 * List all images in a folder
 * @param {string} folder - Folder path (e.g., 'products')
 * @returns {Promise<Array>} Array of file objects
 */
export async function listImages(folder = '') {
    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(folder, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
        });

    if (error) {
        console.error('Error listing images:', error);
        return [];
    }

    return data;
}

/**
 * Generate a unique filename for upload
 * @param {string} originalName - Original filename
 * @returns {string} Unique filename with timestamp
 */
export function generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-');

    return `${nameWithoutExt}-${timestamp}-${randomString}.${extension}`;
}
