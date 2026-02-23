'use client';

import Link from 'next/link';
import ThemeToggle from './theme-toggle';

interface InnerHeaderProps {
  title?: string;
}

export default function InnerHeader({ title }: InnerHeaderProps) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(20px)',
      padding: '1rem 2rem',
      zIndex: 100,
      boxShadow: '0 2px 30px rgba(0, 0, 0, 0.3)',
      animation: 'slideDown 0.7s ease-out',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <Link href="/" style={{
            fontFamily: 'var(--font-nunito)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          >
            ← Cost Nimbus
          </Link>
          {title && <h1 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginTop: '0.5rem',
            color: 'var(--text-primary)',
          }}>{title}</h1>}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
