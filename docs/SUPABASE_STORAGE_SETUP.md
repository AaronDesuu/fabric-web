# Supabase Storage Setup Guide

This guide explains how to set up and use Supabase Storage for product images.

## 🎯 Quick Setup Steps

1. ✅ Create storage bucket in Supabase Dashboard
2. ✅ Run SQL to set up storage policies
3. ✅ Upload existing images to Supabase
4. ✅ Verify images are working

---

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your `fabric-store` project
3. Click **"Storage"** in the left sidebar
4. Click **"New bucket"** button
5. Fill in the form:
   - **Name**: `product-images`
   - **Public bucket**: Toggle **ON** ✅ (Important!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp` (optional)
6. Click **"Create bucket"**

---

## Step 2: Set Up Storage Policies

**Run this SQL in Supabase SQL Editor:**

```sql
-- Allow public read access to product images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Allow authenticated users to upload images (for future admin panel)
create policy "Authenticated users can upload images"
on storage.objects for insert
with check ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update images
create policy "Authenticated users can update images"
on storage.objects for update
using ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete images
create policy "Authenticated users can delete images"
on storage.objects for delete
using ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
```

**To run:**
1. Click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Paste the SQL above
4. Click **"Run"**

---

## Step 3: Upload Existing Images

Now let's upload your existing product images from `/public/images/` to Supabase Storage:

```bash
node scripts/upload-images-to-supabase.js
```

**What this script does:**
- ✅ Checks if the storage bucket exists
- ✅ Finds all products in the database
- ✅ Uploads each product image from `/public/images/` to Supabase Storage
- ✅ Updates the database with new Supabase Storage URLs
- ✅ Provides a summary of uploaded images

**Expected output:**
```
🚀 Starting image upload to Supabase Storage...

✅ Found product-images bucket

📦 Found 5 products in database

📤 Uploading red-silk.png for Royal Red Silk Chiffon...
   ✅ Uploaded successfully
   📍 URL: https://htppsonggfeoycsprmgv.supabase.co/storage/v1/object/public/product-images/products/red-silk.png
   ✅ Updated database

... (more products)

✨ Image upload complete!
```

---

## Step 4: Verify Images

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Go to http://localhost:3000
   - Check the home page - you should see featured product images
   - Go to `/shop` - all products should have images
   - Click on a product - detail page should show the image

3. **Check in Supabase Dashboard:**
   - Go to **Storage** → **product-images** bucket
   - You should see a `products/` folder with all your images

---

## 📁 File Structure

After setup, your images will be organized like this:

```
Supabase Storage (product-images bucket)
└── products/
    ├── red-silk.png
    ├── blue-batik.png
    ├── japanese-cotton.png
    ├── white-linen.png
    └── green-velvet.png
```

**Image URLs will look like:**
```
https://htppsonggfeoycsprmgv.supabase.co/storage/v1/object/public/product-images/products/red-silk.png
```

---

## 🔧 Helper Functions

We've created helper functions in `lib/supabase/storage.js`:

### Get Image URL
```javascript
import { getImageUrl } from '@/lib/supabase/storage';

const url = getImageUrl('products/red-silk.png');
// Returns: https://...supabase.co/storage/v1/object/public/product-images/products/red-silk.png
```

### Upload Image
```javascript
import { uploadImage } from '@/lib/supabase/storage';

const file = event.target.files[0]; // From input[type="file"]
const path = 'products/my-new-image.jpg';

const { url, path, error } = await uploadImage(file, path);

if (!error) {
    console.log('Image uploaded:', url);
}
```

### Delete Image
```javascript
import { deleteImage } from '@/lib/supabase/storage';

const { success, error } = await deleteImage('products/old-image.png');
```

### List Images in Folder
```javascript
import { listImages } from '@/lib/supabase/storage';

const images = await listImages('products');
console.log(images); // Array of file objects
```

### Generate Unique Filename
```javascript
import { generateUniqueFileName } from '@/lib/supabase/storage';

const uniqueName = generateUniqueFileName('product.jpg');
// Returns: product-1702345678-abc123.jpg
```

---

## 🎨 Future: Admin Panel for Image Upload

You can create an admin panel to upload images directly to Supabase:

```jsx
'use client';

import { uploadImage, generateUniqueFileName } from '@/lib/supabase/storage';
import { useState } from 'react';

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const uniqueName = generateUniqueFileName(file.name);
        const path = `products/${uniqueName}`;

        const { url, error } = await uploadImage(file, path);

        if (error) {
            alert('Upload failed: ' + error.message);
        } else {
            alert('Uploaded! URL: ' + url);
            // Now update your product in the database with this URL
        }

        setUploading(false);
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
            />
            {uploading && <p>Uploading...</p>}
        </div>
    );
}
```

---

## 🗑️ Cleanup Local Images (Optional)

After confirming all images are working from Supabase Storage, you can:

1. **Keep local images as backup** (recommended for now)
2. **Or delete them** to save space:
   ```bash
   # Be careful! Make sure Supabase images are working first!
   rm public/images/red-silk.png
   rm public/images/blue-batik.png
   rm public/images/japanese-cotton.png
   rm public/images/white-linen.png
   rm public/images/green-velvet.png
   ```

---

## 🚀 Benefits of Supabase Storage

✅ **Scalable** - No limits on number of images
✅ **Fast CDN** - Images served from global CDN
✅ **Secure** - Row Level Security policies
✅ **Cost-effective** - Free tier: 1GB storage, 2GB bandwidth/month
✅ **Easy management** - Upload/delete via dashboard or API
✅ **Image transformations** - Resize, optimize images on-the-fly (future feature)

---

## 🆘 Troubleshooting

### Images not showing after upload

1. **Check bucket is public:**
   - Go to Storage → product-images
   - Settings → Make sure "Public bucket" is enabled

2. **Check policies:**
   - Verify the "Public Access" policy exists
   - Run the SQL from Step 2 again

3. **Check image URLs in database:**
   ```sql
   select name_en, image_url from products;
   ```
   - URLs should start with `https://...supabase.co/storage/`

### Upload script fails

1. **Check bucket exists:**
   - The script will tell you if bucket doesn't exist
   - Create it in Supabase Dashboard first

2. **Check image files exist:**
   - Verify `/public/images/` has the PNG files
   - File names must match the mapping in the script

---

## 📝 Summary

1. ✅ Created `product-images` bucket (public)
2. ✅ Set up storage policies for access control
3. ✅ Created helper functions in `lib/supabase/storage.js`
4. ✅ Uploaded existing images to Supabase Storage
5. ✅ Updated database with new image URLs

Your product images are now hosted on Supabase! 🎉
