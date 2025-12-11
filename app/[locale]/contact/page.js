import { getTranslations } from 'next-intl/server';

export default async function ContactPage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '800px' }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-primary)',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                {t('title')}
            </h1>

            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('aboutTitle')}</h2>
                <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: '#444' }}>
                    {t('aboutText')}
                </p>
                <div style={{ width: '100%', height: '1px', background: '#e5e5e5', margin: '2rem 0' }}></div>

                <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('infoTitle')}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <span style={{ fontWeight: '600', minWidth: '100px' }}>{t('addressLabel')}:</span>
                        <span>
                            Jl. Textile Premium No. 88<br />
                            Jakarta Pusat, Indonesia 10110
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: '600', minWidth: '100px' }}>Email:</span>
                        <a href="mailto:hello@scorpiotextiles.com" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                            hello@scorpiotextiles.com
                        </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: '600', minWidth: '100px' }}>WhatsApp:</span>
                        <span>+62 812 3456 7890</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
