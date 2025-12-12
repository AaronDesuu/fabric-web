/**
 * Migration script to upload existing products to Supabase
 *
 * How to run:
 * 1. Make sure you've added your Supabase credentials to .env.local
 * 2. Run: node scripts/migrate-products.js
 */

import { createClient } from '@supabase/supabase-js';
import { products } from '../lib/products.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.error('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

async function migrateProducts() {
    console.log('🚀 Starting product migration to Supabase...\n');

    // First, check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
        .from('products')
        .select('id, name_en');

    if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing products:', checkError);
        process.exit(1);
    }

    if (existingProducts && existingProducts.length > 0) {
        console.log(`⚠️  Warning: Found ${existingProducts.length} existing products in database.`);
        console.log('   Existing products:');
        existingProducts.forEach(p => console.log(`   - ${p.name_en}`));
        console.log('\n   Skipping migration to avoid duplicates.');
        console.log('   If you want to re-migrate, delete existing products first.\n');
        return;
    }

    // Transform products to match database schema
    const productsForDB = products.map((product, index) => ({
        name_en: product.name.en,
        name_id: product.name.id,
        description_en: product.description?.en || '',
        description_id: product.description?.id || '',
        price: product.price,
        category: product.category,
        image_url: product.image,
        stock_meters: 100, // Default stock - adjust as needed
        featured: index < 3, // Make first 3 products featured
        active: true
    }));

    console.log(`📦 Preparing to migrate ${productsForDB.length} products...\n`);

    // Insert products one by one to better handle errors
    const insertedProducts = [];
    for (const product of productsForDB) {
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) {
            console.error(`❌ Error inserting ${product.name_en}:`, error.message);
            continue;
        }

        insertedProducts.push(data);
        console.log(`✅ Inserted: ${product.name_en}`);
    }

    if (insertedProducts.length === 0) {
        console.error('\n❌ No products were inserted. Please check the error above.');
        console.error('\nTo fix this, run this SQL in Supabase SQL Editor:');
        console.error('---');
        console.error('create policy "Temporary: Allow product inserts"');
        console.error('    on public.products for insert');
        console.error('    with check (true);');
        console.error('---');
        process.exit(1);
    }

    const data = insertedProducts;

    console.log(`\n✅ Successfully migrated ${data.length} products!\n`);

    // Display the migrated products
    console.log('📋 Migrated products:');
    data.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name_en} (${product.name_id})`);
        console.log(`      Category: ${product.category} | Price: Rp ${product.price.toLocaleString()}`);
        console.log(`      Featured: ${product.featured ? 'Yes' : 'No'} | ID: ${product.id}\n`);
    });

    console.log('✨ Migration complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update your product fetching code to use Supabase');
    console.log('   2. Test the products display on your site');
    console.log('   3. Add more products through Supabase dashboard or API\n');
}

migrateProducts().catch(console.error);
