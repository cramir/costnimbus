'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './theme-toggle';

const NAV_ITEMS = [
  { href: '/', label: 'Home', exact: true },
  { href: '/about', label: 'About', exact: true },
  { href: '/tools', label: 'Tools', exact: true },
  { href: '/resources', label: 'Resources', exact: false },
  { href: '/calculators', label: 'Calculators', exact: false },
  { href: '/articles', label: 'Articles', exact: false },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav style={{
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
        <Link href="/" style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            color: 'var(--accent-cyan)',
            fontSize: '1.3rem',
          }}>$</span>
          Cost Nimbus
          <span className="nav-badge" style={{
            fontFamily: 'var(--font-nunito)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginLeft: '1rem',
            padding: '0.4rem 1rem',
            background: 'rgba(0, 212, 255, 0.08)',
            borderRadius: '20px',
            fontWeight: 600,
            border: '1px solid rgba(0, 212, 255, 0.15)',
          }}>Cloud Cost Intelligence</span>
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {menuOpen && (
              <button
                className="mobile-menu-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{ position: 'absolute', top: '1rem', right: '1.5rem', zIndex: 160 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {NAV_ITEMS.map(({ href, label, exact }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${isActive(href, exact) ? 'nav-link-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
