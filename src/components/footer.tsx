export default function Footer({ animationDelay = '0.4s' }: { animationDelay?: string }) {
    return (
        <footer style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border-subtle)',
            position: 'relative',
            zIndex: 1,
            animation: `fadeInUp 0.9s ease-out ${animationDelay} both`,
        }}>
            <p style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
            }}>© 2026 Cost Nimbus. Built by engineers, for engineers.</p>
        </footer>
    );
}
