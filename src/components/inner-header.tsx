'use client';

import Link from 'next/link';
import ThemeToggle from './theme-toggle';

interface InnerHeaderProps {
  title?: string;
}

export default function InnerHeader({ title }: InnerHeaderProps) {
  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <div>
          <Link href="/" className="inner-header-back">
            ← Cost Nimbus
          </Link>
          {title && (
            <h1 style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              marginTop: '0.5rem',
              color: 'var(--text-primary)',
            }}>
              {title}
            </h1>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
