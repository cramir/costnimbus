import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

export default function AuthorBio() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.25rem',
      padding: '1.5rem',
      marginTop: '3rem',
      marginBottom: '3rem',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
          color: 'var(--accent-cyan)',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-jetbrains-mono)',
        }}>
          Written by
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          Cesar Ramirez
        </div>
        <p style={{
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          margin: '0 0 1rem 0',
        }}>
          SOC infrastructure engineer. Saved $50K/month in cloud costs by building custom tooling and automating resource cleanup. Writes about cloud cost optimization, security operations, and infrastructure automation.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/cramir"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Github size={16} style={{ marginRight: '0.5rem' }} />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/cramir4"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Linkedin size={16} style={{ marginRight: '0.5rem' }} />
            LinkedIn
          </a>
          <Link
            href="/about"
            style={{
              fontSize: '0.8rem',
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            More about me →
          </Link>
        </div>
      </div>
    </div>
  );
}
