/**
 * Script to upload existing product images to Supabase Storage
 * and update product image URLs in the database
 *
 * How to run:
 * node scripts/upload-images-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'product-images';

// Mapping of current image paths to actual file names
const imageMapping = {
    '/images/red-silk.png': 'red-silk.png',
    '/images/blue-batik.png': 'blue-batik.png',
    '/images/japanese-cotton.png': 'japanese-cotton.png',
    '/images/white-linen.png': 'white-linen.png',
    '/images/green-velvet.png': 'green-velvet.png'
};

async function uploadImagesToSupabase() {
    console.log('🚀 Starting image upload to Supabase Storage...\n');

    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error('❌ Error listing buckets:', bucketError);
        process.exit(1);
    }

    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
        console.error('❌ Error: Bucket "product-images" does not exist!');
        console.error('   Please create the bucket in Supabase Dashboard first.');
        console.error('   Go to Storage → New Bucket → Name: "product-images" → Public: ON');
        process.exit(1);
    }

    console.log('✅ Found product-images bucket\n');

    // Get all products from database
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name_en, image_url');

    if (productsError) {
        console.error('❌ Error fetching products:', productsError);
        process.exit(1);
    }

    console.log(`📦 Found ${products.length} products in database\n`);

    const publicDir = path.join(__dirname, '..', 'public');
    const uploadResults = [];

    // Upload each image
    for (const product of products) {
        const currentImageUrl = product.image_url;
        const imageName = imageMapping[currentImageUrl];

        if (!imageName) {
            console.log(`⚠️  Skipping ${product.name_en}: No image mapping found`);
            continue;
        }

        const localImagePath = path.join(publicDir, 'images', imageName);

        // Check if local file exists
        if (!fs.existsSync(localImagePath)) {
            console.log(`⚠️  Skipping ${product.name_en}: Image file not found at ${localImagePath}`);
            continue;
        }

        // Read file
        const fileBuffer = fs.readFileSync(localImagePath);
        const storagePath = `products/${imageName}`;

        console.log(`📤 Uploading ${imageName} for ${product.name_en}...`);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
                contentType: 'image/png',
                cacheControl: '3600',
                upsert: true // Overwrite if exists
            });

        if (uploadError) {
            console.error(`   ❌ Failed to upload: ${uploadError.message}`);
            continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        console.log(`   ✅ Uploaded successfully`);
        console.log(`   📍 URL: ${publicUrl}`);

        // Update product in database
        const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: publicUrl })
            .eq('id', product.id);

        if (updateError) {
            console.error(`   ❌ Failed to update database: ${updateError.message}`);
            continue;
        }

        console.log(`   ✅ Updated database\n`);

        uploadResults.push({
            product: product.name_en,
            oldUrl: currentImageUrl,
            newUrl: publicUrl,
            success: true
        });
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Upload Summary');
    console.log('='.repeat(60));
    console.log(`Total products: ${products.length}`);
    console.log(`Successfully uploaded: ${uploadResults.length}`);
    console.log(`Failed/Skipped: ${products.length - uploadResults.length}`);
    console.log('='.repeat(60) + '\n');

    if (uploadResults.length > 0) {
        console.log('✅ Successfully uploaded images:');
        uploadResults.forEach(r => {
            console.log(`   • ${r.product}`);
            console.log(`     Old: ${r.oldUrl}`);
            console.log(`     New: ${r.newUrl}\n`);
        });
    }

    console.log('✨ Image upload complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Verify images are visible on your website');
    console.log('   2. You can now delete local images from /public/images if desired');
    console.log('   3. Future images should be uploaded directly to Supabase Storage\n');
}

uploadImagesToSupabase().catch(console.error);
