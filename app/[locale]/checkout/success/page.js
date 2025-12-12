'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage({ params }) {
    // Unwrap params (in Next.js 15+ params is a promise, but we can treat as object in older versions or use React.use())
    // For safety in this environment, we'll try to unwrap or use directly.
    // The previous file used an async unwrap pattern.
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        const resolveParams = async () => {
            // Check if params is a promise
            const resolved = await params;
            setLocale(resolved.locale);
        };
        resolveParams();
    }, [params]);

    const t = useTranslations('Checkout');
    const searchParams = useSearchParams();

    // We expect the WhatsApp message URL to be passed in searchParams or generated here? 
    // To generate it here, we'd need the order details again. 
    // BETTER APPROACH: Pass the encoded message in the URL or LocalStorage? 
    // URLs have length limits. LocalStorage is safer.
    // OR: Re-construct the message? We don't have cart data anymore (it should be cleared).
    // Let's assume the previous page passes the `wa_url` encoded in the query param? 
    // No, URL limits.

    // ALTERNATIVE: The "Send to WhatsApp" button here acts as the "final" step.
    // Ideally we should fetch the order details by ID to reconstruct the message, but that requires an API call.
    // FOR SIMPLICITY given the prompt: "brief explanation and a button to toggle".
    // I will pass the 'wa_link' in localStorage from the checkout page, read it here, then clear it.

    const [waLink, setWaLink] = useState('');
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const link = localStorage.getItem('pending_wa_link');
        if (link) {
            setWaLink(link);
        }
    }, []);

    const handleSendToWhatsApp = () => {
        if (waLink) {
            window.open(waLink, '_blank');
            // Optional: Clear it after sending, or keep it in case they need to click again.
            localStorage.removeItem('pending_wa_link');
        }
    };

    return (
        <div className="max-w-container mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>

            <h1 className="text-3xl font-heading text-primary mb-4">
                {locale === 'id' ? 'Pesanan Berhasil Disimpan!' : 'Order Saved Successfully!'}
            </h1>

            <p className="text-gray-600 mb-2">
                Order ID: <span className="font-mono font-bold text-gray-900">#{orderId ? orderId.substring(0, 8) : '...'}</span>
            </p>

            <p className="max-w-md mx-auto text-gray-600 mb-8 leading-relaxed">
                {locale === 'id'
                    ? 'Pesanan Anda telah disimpan di sistem kami. Tahap terakhir adalah mengirimkan detail pesanan ke WhatsApp admin untuk pembayaran & pengiriman.'
                    : 'Your order has been saved in our system. The final step is to send the order details to our admin on WhatsApp for payment & delivery.'}
            </p>

            <div className="flex flex-col items-center gap-4">
                {waLink && (
                    <button
                        onClick={handleSendToWhatsApp}
                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 transform hover:scale-105 animate-pulse"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        {locale === 'id' ? 'Kirim ke WhatsApp' : 'Send to WhatsApp'}
                    </button>
                )}

                <Link href="/" className="text-primary hover:underline text-sm font-medium mt-4">
                    {locale === 'id' ? 'Kembali ke Beranda' : 'Return to Home'}
                </Link>
            </div>
        </div>
    );
}
