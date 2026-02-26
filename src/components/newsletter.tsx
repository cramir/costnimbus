'use client';

export default function Newsletter({ wrapInSection = true }: { wrapInSection?: boolean }) {
    const content = (
        <div className="newsletter-card" style={!wrapInSection ? { marginTop: '5rem' } : undefined}>
            <div className="newsletter-card-glow" />

            <h2 style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '2.2rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
                position: 'relative',
                zIndex: 1,
            }}>Get weekly cloud cost tips</h2>
            <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '2.5rem',
                fontSize: '1rem',
                lineHeight: 1.8,
                position: 'relative',
                zIndex: 1,
            }}>Join engineers saving money on cloud costs. Actionable strategies every Friday.</p>

            {/* SendFox Form */}
            <form
                method="post"
                action="https://sendfox.com/form/3qdz96/36enr2"
                className="sendfox-form"
                id="36enr2"
                data-async="true"
                data-recaptcha="true"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <label htmlFor="newsletter-name" className="sr-only">Your name</label>
                <input
                    id="newsletter-name"
                    type="text"
                    name="first_name"
                    placeholder="Your name"
                    required
                    className="newsletter-input"
                />
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    className="newsletter-input"
                />
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input type="text" name="a_password" tabIndex={-1} value="" readOnly autoComplete="off" />
                </div>
                <button type="submit" className="newsletter-btn">
                    Subscribe ✨
                </button>
            </form>
            <script src="https://cdn.sendfox.com/js/form.js" charSet="utf-8" async></script>
        </div>
    );

    if (!wrapInSection) return content;

    return (
        <section className="section-animate" style={{ animation: 'fadeInUp 0.9s ease-out 0.6s both' }}>
            {content}
        </section>
    );
}
