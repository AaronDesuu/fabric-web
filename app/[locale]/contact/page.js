import { getTranslations } from 'next-intl/server';

export default async function ContactPage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });

    return (
        <div className="pt-16 pb-16 max-w-[800px] mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-heading text-primary mb-8 text-center">
                {t('title')}
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-sm mb-8 border border-black/5">
                <h2 className="text-2xl font-heading text-primary mb-4">{t('aboutTitle')}</h2>
                <p className="mb-6 leading-relaxed text-[#444]">
                    {t('aboutText')}
                </p>
                <div className="w-full h-px bg-gray-200 my-8"></div>

                <h2 className="text-2xl font-heading text-primary mb-4">{t('infoTitle')}</h2>

                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <span className="font-semibold min-w-[100px]">{t('addressLabel')}:</span>
                        <span>
                            Jl. Textile Premium No. 88<br />
                            Jakarta Pusat, Indonesia 10110
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-semibold min-w-[100px]">Email:</span>
                        <a href="mailto:hello@scorpiotextiles.com" className="text-primary underline hover:text-[#5c1313] transition-colors">
                            hello@scorpiotextiles.com
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-semibold min-w-[100px]">WhatsApp:</span>
                        <span>+62 812 3456 7890</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
