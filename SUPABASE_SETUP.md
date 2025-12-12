# Supabase Setup Guide for Fabric Store

## 🎯 Quick Start Checklist

- [ ] Create Supabase account and project
- [ ] Get API credentials
- [ ] Set up environment variables
- [ ] Run database schema
- [ ] Migrate existing products
- [ ] Update product fetching code
- [ ] Test the application

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/login (GitHub login recommended)
3. Click **"New Project"**
4. Fill in project details:
   - **Name**: `fabric-store` (or your preferred name)
   - **Database Password**: Create a strong password ⚠️ **SAVE THIS PASSWORD!**
   - **Region**: Choose closest to your users (e.g., Southeast Asia - Singapore)
   - **Pricing Plan**: **Free**
5. Click **"Create new project"**
6. Wait ~2 minutes for project to initialize

---

## Step 2: Get API Credentials

1. In your Supabase dashboard, click the **Settings** icon (⚙️) in the left sidebar
2. Click **"API"** in the settings menu
3. Copy these two values:

   **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key** (under "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
   ```

---

## Step 3: Set Up Environment Variables

1. Open the file `.env.local` in your project root
2. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

3. **Save the file**

⚠️ **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

---

## Step 4: Run Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` in your code editor
4. **Copy ALL the SQL code** from `schema.sql`
5. **Paste it** into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. Wait for "Success. No rows returned" message

This creates all the tables:
- ✅ `products` - Your fabric products
- ✅ `product_images` - Multiple images per product
- ✅ `orders` - Customer orders
- ✅ `order_items` - Items in each order
- ✅ `profiles` - User profile information

---

## Step 5: Migrate Existing Products

Now let's upload your 5 existing products to Supabase:

1. Open your terminal in the project root
2. Run the migration script:

```bash
node scripts/migrate-products.js
```

3. You should see:
```
🚀 Starting product migration to Supabase...
📦 Preparing to migrate 5 products...
✅ Successfully migrated 5 products!
```

4. Verify in Supabase:
   - Go to **"Table Editor"** in the sidebar
   - Click **"products"** table
   - You should see your 5 products!

---

## Step 6: Update Product Fetching Code

The product fetching code needs to be updated to use Supabase instead of the local `products.js` file.

**Files that need updating:**
- `app/[locale]/page.js` - Home page featured products
- `app/[locale]/shop/page.js` - Shop page product listing
- `app/[locale]/shop/[id]/page.js` - Product detail page

We'll update these to fetch from Supabase instead of the local array.

---

## Step 7: Test Everything

1. Start your development server:
```bash
npm run dev
```

2. Test these pages:
   - **Home page** (`http://localhost:3000`) - Featured products should show
   - **Shop page** (`http://localhost:3000/shop`) - All products should display
   - **Product detail** - Click any product to see details

---

## 🎉 What You Get with Supabase

### Current Features
- ✅ Product database with multi-language support
- ✅ Stock tracking (meters of fabric)
- ✅ Category filtering
- ✅ Featured products flag
- ✅ Active/inactive products
- ✅ Order management system
- ✅ Customer profiles

### Future Features You Can Add
- 🔐 User authentication (login/signup)
- 👤 Customer accounts with order history
- 📦 Inventory management
- 📊 Admin dashboard for managing products
- 🖼️ Multiple images per product
- ⭐ Product reviews and ratings
- 🔍 Advanced search and filtering
- 📈 Analytics and sales reports

---

## 📚 Useful Supabase Dashboard Links

Once your project is created:

- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom SQL queries
- **Database**: Manage tables, functions, triggers
- **Authentication**: Set up user login (for later)
- **Storage**: Upload and manage product images (for later)
- **API Docs**: Auto-generated API documentation for your database

---

## 🆘 Troubleshooting

### "Missing Supabase credentials" error
- Check that `.env.local` exists and has the correct values
- Make sure there are no extra spaces in the credentials
- Restart your development server after adding credentials

### Products not showing on the website
- Verify products were migrated: Check Table Editor in Supabase
- Check browser console for errors
- Make sure `active` column is `true` for products

### Migration script fails
- Verify your Supabase credentials in `.env.local`
- Make sure you ran the schema SQL first
- Check the error message for specific issues

---

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Next.js + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

---

## 🚀 Next Steps After Setup

1. **Add more products**: Use Supabase Table Editor or create an admin panel
2. **Upload product images**: Set up Supabase Storage for images
3. **Enable authentication**: Let customers create accounts
4. **Order management**: Process orders through dashboard
5. **Deploy to Vercel**: Add environment variables in Vercel dashboard
