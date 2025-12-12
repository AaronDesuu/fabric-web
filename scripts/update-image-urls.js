import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

async function updateImageUrls() {
    console.log('🔄 Updating product image URLs to Supabase Storage...\n');

    // Get all products from database
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, name_en, image_url');

    if (fetchError) {
        console.error('❌ Error fetching products:', fetchError);
        return;
    }

    console.log(`📦 Found ${products.length} products\n`);

    let successCount = 0;
    let failCount = 0;

    // Update each product by ID
    for (const product of products) {
        // Extract filename from current path
        // Handle both '/images/red-silk.png' and '/images/product/red-silk.png'
        const filename = product.image_url.split('/').pop();

        // Build new Supabase URL
        const newUrl = `${BASE_URL}/storage/v1/object/public/product-images/products/${filename}`;

        console.log(`📝 Updating: ${product.name_en}`);
        console.log(`   Old: ${product.image_url}`);
        console.log(`   New: ${newUrl}`);

        // Update by ID (not by image_url to avoid RLS issues)
        const { data, error } = await supabase
            .from('products')
            .update({ image_url: newUrl })
            .eq('id', product.id)
            .select('name_en');

        if (error) {
            console.error(`   ❌ Error: ${error.message}\n`);
            failCount++;
            continue;
        }

        if (data && data.length > 0) {
            console.log(`   ✅ Success!\n`);
            successCount++;
        } else {
            console.log(`   ⚠️  No rows updated\n`);
            failCount++;
        }
    }

    console.log('='.repeat(60));
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('='.repeat(60));

    console.log('✨ Database update complete!\n');
}

updateImageUrls();
