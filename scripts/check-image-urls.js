import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkImageUrls() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name_en, image_url')
        .order('created_at');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n📋 Current product image URLs:\n');
    products.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name_en}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Image: ${p.image_url}\n`);
    });
}

checkImageUrls();
