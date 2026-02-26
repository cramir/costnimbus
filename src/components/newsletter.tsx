'use client';

export default function Newsletter({ wrapInSection = true }: { wrapInSection?: boolean }) {
    const content = (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '3.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow)',
            ...(!wrapInSection ? { marginTop: '5rem' } : {})
        }}>
            <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-cyan))',
                borderRadius: '26px',
                zIndex: -1,
                opacity: 0.3,
            }}></div>

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
                <input
                    type="text"
                    name="first_name"
                    placeholder="Your name"
                    required
                    style={{
                        width: '100%',
                        padding: '1.1rem 1.5rem',
                        fontFamily: 'var(--font-nunito)',
                        fontSize: '1rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                    }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    style={{
                        width: '100%',
                        padding: '1.1rem 1.5rem',
                        fontFamily: 'var(--font-nunito)',
                        fontSize: '1rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                    }}
                />
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input type="text" name="a_password" tabIndex={-1} value="" readOnly autoComplete="off" />
                </div>
                <button
                    type="submit"
                    style={{
                        fontFamily: 'var(--font-nunito)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        padding: '1.2rem 2rem',
                        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginTop: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 212, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    Subscribe ✨
                </button>
            </form>
            <script src="https://cdn.sendfox.com/js/form.js" charSet="utf-8" async></script>
        </div>
    );

    if (!wrapInSection) return content;

    return (
        <section style={{
            padding: '6rem 2rem',
            position: 'relative',
            zIndex: 1,
            animation: 'fadeInUp 0.9s ease-out 0.6s both',
        }}>
            {content}
        </section>
    );
}
