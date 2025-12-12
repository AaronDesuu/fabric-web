'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-[#3d0a0a] via-[#4a0e0e] to-[#3d0a0a] text-white py-8 border-t border-white/10">
            <div className="max-w-container mx-auto px-4">
                {/* Elegant Brand Section with White Background */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl px-2 py-5 flex flex-col items-center gap-3 border-2 border-gray-100 max-w-2xl w-full">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/scorpion.png"
                                alt="Scorpio"
                                className="h-10 w-10 drop-shadow-md"
                            />
                            <span className="font-heading text-3xl font-bold text-primary tracking-wide">
                                SCORPIO
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-gradient-to-r from-primary via-accent to-primary rounded-full"></div>
                        <p className="text-secondary text-center text-sm leading-relaxed font-medium max-w-lg">
                            {t('description')}
                        </p>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-3xl mx-auto">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h3 className="font-heading text-base font-semibold text-white mb-1 flex items-center gap-2 justify-center md:justify-start">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {t('location')}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {t('address')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h3 className="font-heading text-base font-semibold text-white mb-1 flex items-center gap-2 justify-center md:justify-start">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            {t('contact')}
                        </h3>
                        <a href="mailto:hello@scorpiotextiles.com" className="text-gray-300 text-sm hover:text-white transition-colors">
                            hello@scorpiotextiles.com
                        </a>
                        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-white transition-colors flex items-center gap-2 justify-center md:justify-start">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            +62 812 3456 7890
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-4 border-t border-white/20 text-center">
                    <p className="text-gray-300 text-xs">
                        {t('copyright', { year: currentYear })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
