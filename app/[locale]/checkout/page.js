'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';

export default function CheckoutPage({ params }) {
    const { cart } = useCart();
    const router = useRouter();
    // Unwrap params using React.use() or await if standard in Next 15+ (Params is a Promise)
    // For client components we can often access directly but let's be safe
    // Since this is a client component, `useParams` hook is safer or async unwrapping
    // But sticking to standard Next.js client pattern
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setLocale(resolvedParams.locale);
        };
        unwrapParams();
    }, [params]);

    const t = useTranslations('Checkout');
    const tPayment = useTranslations('PaymentDelivery');

    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        address: '',
        notes: '',
        paymentMethod: 'bank_transfer',
        deliveryMethod: 'jne'
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const formatPrice = (amount) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format Order Text
        let message = `*New Order from Website*\n\n`;
        message += `*Customer Details:*\n`;
        message += `Name: ${formData.name}\n`;
        message += `WhatsApp: ${formData.whatsapp}\n`;
        message += `Address: ${formData.address}\n`;
        if (formData.notes) message += `Notes: ${formData.notes}\n`;

        message += `\n*Order Details:*\n`;
        cart.forEach(item => {
            message += `- ${item.name[locale] || item.name['en']} (${item.quantity}m) - ${formatPrice(item.price * item.quantity)}\n`;
        });

        message += `\n*Total: ${formatPrice(total)}*\n`;
        message += `\nPayment: ${formData.paymentMethod.replace('_', ' ').toUpperCase()}`;
        message += `\nDelivery: ${formData.deliveryMethod.toUpperCase()}`;

        // Encode and Redirect
        const phoneNumber = '6281234567890'; // Placeholder - replace with real number
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-heading text-secondary mb-4">{t('emptyCart')}</h2>
                <Link href="/shop" className="btn-primary">
                    {t('returnToShop')}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-container mx-auto px-4 py-8 md:py-12">
            <div className="sticky top-[73px] z-[90] bg-white/95 backdrop-blur-sm -mx-4 px-4 py-4 mb-8 flex items-center justify-center border-b border-gray-100 shadow-sm transition-all">
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl md:text-3xl font-heading text-primary text-center m-0">{t('title')}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column: Forms */}
                <div className="space-y-8">
                    {/* Contact Info */}
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                            <span>1.</span> {t('contactDetails')}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('name')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('whatsapp')}</label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('address')}</label>
                                <textarea
                                    name="address"
                                    required
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('notes')}</label>
                                <textarea
                                    name="notes"
                                    rows="2"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Radio Selections */}
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                            <span>2.</span> {t('paymentMethod')}
                        </h2>
                        <div className="space-y-3">
                            {['bank_transfer', 'qris_ewallet'].map((method) => (
                                <label key={method} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-red-50/10 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={formData.paymentMethod === method}
                                        onChange={handleChange}
                                        className="accent-primary w-5 h-5"
                                    />
                                    <span className="font-medium text-gray-800">
                                        {method === 'bank_transfer' ? tPayment('bankTransfer') : tPayment('ewallet')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                            <span>3.</span> {t('deliveryMethod')}
                        </h2>
                        <div className="space-y-3">
                            {['jne', 'jnt', 'instant', 'pickup'].map((method) => (
                                <label key={method} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-red-50/10 transition-colors">
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value={method}
                                        checked={formData.deliveryMethod === method}
                                        onChange={handleChange}
                                        className="accent-primary w-5 h-5"
                                    />
                                    <span className="font-medium text-gray-800">
                                        {method === 'jne' && 'JNE Express'}
                                        {method === 'jnt' && 'J&T Express'}
                                        {method === 'instant' && (
                                            <span className="flex flex-col">
                                                <span>{tPayment('instant')}</span>
                                                <span className="text-xs text-gray-500 font-normal">Gojek / Grab</span>
                                            </span>
                                        )}
                                        {method === 'pickup' && tPayment('pickup')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <div className="bg-gray-50 p-6 md:p-8 rounded-lg border border-gray-200 sticky top-[160px]">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">{t('orderSummary')}</h2>

                        <div className="max-h-[300px] overflow-y-auto mb-6 pr-2">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                                    <div>
                                        <p className="font-serif font-medium text-gray-900">{item.name[locale] || item.name['en']}</p>
                                        <p className="text-sm text-gray-500">{item.quantity}m x {formatPrice(item.price)}</p>
                                    </div>
                                    <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-300 pt-4 space-y-2 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>{t('subtotal')}</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-primary pt-2">
                                <span>{t('total')}</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            {t('placeOrder')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
