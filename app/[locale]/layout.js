import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import { CartProvider } from '@/context/CartContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

export const metadata = {
  title: "Fabric Shop",
  description: "Premium Fabric Store",
};

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
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
