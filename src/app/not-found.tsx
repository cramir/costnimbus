import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-space-grotesk)',
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem',
      }}>404</h1>
      <p style={{
        fontSize: '1.15rem',
        color: 'var(--text-secondary)',
        marginBottom: '2rem',
        maxWidth: '500px',
      }}>
        This page doesn&apos;t exist — but your cloud savings opportunity does.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          padding: '0.8rem 2rem',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          color: '#0d1117',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>Home</Link>
        <Link href="/calculators" style={{
          padding: '0.8rem 2rem',
          border: '1px solid var(--accent-cyan)',
          color: 'var(--accent-cyan)',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>Calculators</Link>
        <Link href="/articles" style={{
          padding: '0.8rem 2rem',
          border: '1px solid var(--accent-purple)',
          color: 'var(--accent-purple)',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>Articles</Link>
      </div>
    </div>
  );
}
