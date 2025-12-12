import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { CartProvider } from '@/context/CartContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Analytics } from '@vercel/analytics/react';
import "../globals.css";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return {
    title: locale === 'id' ? 'Toko Kain Scorpio' : "Scorpio Fabric's",
    description: locale === 'id' ? 'Toko Kain Premium' : "Premium Fabric Store",
    icons: {
      icon: '/images/logo.jpg',
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Navbar locale={locale} />
            <CartSidebar locale={locale} />
            {children}
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
