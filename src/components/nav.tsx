'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './theme-toggle';

export default function Nav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            color: 'var(--accent-cyan)',
            fontSize: '1.3rem',
          }}>$</span>
          Cost Nimbus
          <span style={{
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

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
          }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.6rem 1.3rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.border = '1px solid rgba(0, 212, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = 'none';
                }
              }}
            >
              Home
            </Link>
            <Link
              href="/about"
              style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/about') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.6rem 1.3rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive('/about')) {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.border = '1px solid rgba(0, 212, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/about')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = 'none';
                }
              }}
            >
              About
            </Link>
            <Link
              href="/tools"
              style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/tools') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.6rem 1.3rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive('/tools')) {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.border = '1px solid rgba(0, 212, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/tools')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = 'none';
                }
              }}
            >
              Tools
            </Link>
            <Link
              href="/calculators"
              style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: pathname.startsWith('/calculators') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.6rem 1.3rem',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!pathname.startsWith('/calculators')) {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.border = '1px solid rgba(0, 212, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!pathname.startsWith('/calculators')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = 'none';
                }
              }}
            >
              Calculators
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
