'use client';

import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
      }}
    >
      {items.map((item, idx) => (
        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {idx > 0 && (
            <span style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              userSelect: 'none',
            }}>›</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}
              aria-current="page"
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
