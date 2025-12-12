import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBucket() {
    console.log('\n🔍 Listing all buckets...\n');

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    console.log('Found buckets:', buckets.map(b => b.name));
    console.log('\nBucket details:');
    buckets.forEach(b => {
        console.log(`  - Name: ${b.name}`);
        console.log(`    ID: ${b.id}`);
        console.log(`    Public: ${b.public}`);
        console.log('');
    });
}

testBucket();
