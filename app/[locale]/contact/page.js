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
                <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-lg transition-all mb-8 w-full md:w-fit shadow-sm group"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {t('whatsapp')}
                </a>

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
                            Surabaya, Jawa Timur, Indonesia
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
