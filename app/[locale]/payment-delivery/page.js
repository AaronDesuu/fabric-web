import { getTranslations } from 'next-intl/server';

export default async function PaymentDeliveryPage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'PaymentDelivery' });

    return (
        <div className="max-w-[800px] mx-auto px-4 py-16">
            <h1 className="text-3xl md:text-4xl font-heading text-primary mb-10 text-center">
                {t('title')}
            </h1>

            <div className="grid gap-8">
                {/* Payment Section */}
                <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        {t('paymentTitle')}
                    </h2>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 md:w-12 h-8 md:h-12 bg-gray-50 rounded flex items-center justify-center text-xl shrink-0">🏦</div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('bankTransfer')}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{t('bankTransferDesc')}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">BCA</span>
                                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">Mandiri</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-100"></div>

                        <div className="flex gap-4 items-start">
                            <div className="w-8 md:w-12 h-8 md:h-12 bg-gray-50 rounded flex items-center justify-center text-xl shrink-0">📱</div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('ewallet')}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{t('ewalletDesc')}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">QRIS</span>
                                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">OVO</span>
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">Gopay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Section */}
                <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        {t('deliveryTitle')}
                    </h2>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 md:w-12 h-8 md:h-12 bg-gray-50 rounded flex items-center justify-center text-xl shrink-0">🚚</div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('shipping')}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{t('shippingDesc')}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">JNE</span>
                                    <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">J&T</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-100"></div>

                        <div className="flex gap-4 items-start">
                            <div className="w-8 md:w-12 h-8 md:h-12 bg-gray-50 rounded flex items-center justify-center text-xl shrink-0">🛵</div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('instant')}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{t('instantDesc')}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">Gojek</span>
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">Grab</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-100"></div>

                        <div className="flex gap-4 items-start">
                            <div className="w-8 md:w-12 h-8 md:h-12 bg-gray-50 rounded flex items-center justify-center text-xl shrink-0">🏪</div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">{t('pickup')}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{t('pickupDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
