# Scorpio Textiles - Premium Fabric E-Commerce

A modern, multilingual e-commerce platform for premium fabrics built with Next.js, featuring Supabase integration for database and storage.

## Features

- **Multilingual Support** - English and Indonesian (Bahasa Indonesia) with next-intl
- **Product Catalog** - Browse premium fabrics (Silk, Cotton, Linen, Velvet)
- **Dynamic Product Pages** - Detailed product information with precise measurement controls
- **Shopping Cart** - Add products with custom quantities
- **Supabase Integration** - Database and cloud storage for scalability
- **CDN-Served Images** - Fast image delivery via Supabase Storage
- **Responsive Design** - Optimized for mobile and desktop with Tailwind CSS
- **Smooth Animations** - Parallax effects and scroll animations using Framer Motion

## Tech Stack

- **Framework**: Next.js 16.0.8 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Internationalization**: next-intl
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AaronDesuu/fabric-web.git
cd fabric-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:

- Create a new Supabase project at [supabase.com](https://supabase.com)
- Run the database schema (see `docs/` for SQL scripts)
- Set up Supabase Storage (see [Supabase Storage Setup Guide](docs/SUPABASE_STORAGE_SETUP.md))

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
fabric-web/
├── app/                      # Next.js App Router pages
│   ├── [locale]/            # Internationalized routes
│   │   ├── page.js          # Home page with hero and featured products
│   │   ├── shop/            # Product catalog
│   │   ├── product/         # Individual product pages
│   │   └── checkout/        # Checkout flow
├── components/              # React components
│   ├── Hero.js             # Parallax hero section
│   ├── ProductCard.js      # Product display cards
│   ├── FeaturedProducts.js # Animated featured products
│   └── Footer.js           # Site footer with contact info
├── lib/                    # Utility functions
│   └── supabase/
│       ├── client.js       # Supabase client initialization
│       └── storage.js      # Storage helper functions
├── messages/               # i18n translations
│   ├── en.json            # English
│   └── id.json            # Indonesian
├── scripts/               # Utility scripts
│   ├── migrate-products.js           # Initial product migration
│   ├── upload-images-to-supabase.js  # Image upload to Supabase
│   └── update-image-urls.js          # Update product image URLs
├── docs/                  # Documentation
│   └── SUPABASE_STORAGE_SETUP.md    # Storage setup guide
└── public/               # Static assets
    └── images/           # Local image backups
```

## Supabase Integration

### Database

The application uses Supabase PostgreSQL database with the following schema:

**Products Table:**
- `id` (UUID, primary key)
- `name_en` (text) - English product name
- `name_id` (text) - Indonesian product name
- `description_en` (text) - English description
- `description_id` (text) - Indonesian description
- `price` (numeric) - Price per meter in IDR
- `category` (text) - Fabric category
- `image_url` (text) - Product image URL
- `stock_meters` (numeric) - Available stock
- `min_order_meters` (numeric) - Minimum order quantity

### Storage

Product images are stored in Supabase Storage for:
- **Scalability** - No file size limits on deployment
- **Performance** - Global CDN delivery
- **Security** - Row Level Security policies

See [Supabase Storage Setup Guide](docs/SUPABASE_STORAGE_SETUP.md) for detailed setup instructions.

## Development

### Adding New Products

1. Add product data to the database via Supabase Dashboard or migration script
2. Upload product images using the storage helper functions:

```javascript
import { uploadImage } from '@/lib/supabase/storage';

const { url, error } = await uploadImage(file, 'products/my-image.jpg');
```

### Internationalization

Add translations to `messages/en.json` and `messages/id.json`:

```json
{
  "HomePage": {
    "newKey": "English text"
  }
}
```

Use in components:

```javascript
import { useTranslations } from 'next-intl';

const t = useTranslations('HomePage');
return <h1>{t('newKey')}</h1>;
```

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

The app will automatically build and deploy on every push to main.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `node scripts/migrate-products.js` - Migrate products to Supabase
- `node scripts/upload-images-to-supabase.js` - Upload images to Supabase Storage

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is private and proprietary.

## Support

For questions or issues, please contact:
- Email: hello@scorpiotextiles.com
- WhatsApp: +62 812 3456 7890

---

Built with ❤️ using [Next.js](https://nextjs.org) and [Supabase](https://supabase.com)
