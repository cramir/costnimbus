'use client';

import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import Newsletter from './newsletter';
import Footer from './footer';

export default function AboutContent() {
  return (
    <>
      {/* Cloud decorations */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
      <div className="cloud cloud-4"></div>

      {/* About Content */}
      <article style={{
        padding: '10rem 2rem 6rem',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.2s both',
      }}>
        <header style={{ marginBottom: '4rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            About Cost Nimbus
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            lineHeight: 1.8,
          }}>
            Real strategies that work — built by engineers, for engineers
          </p>
        </header>

        {/* Background */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}>The Engineer</h2>
          <div style={{
            lineHeight: 1.8,
            color: 'var(--text-primary)',
            fontSize: '1rem',
          }}>
            <p style={{ marginBottom: '1rem' }}>
              I&apos;m Cesar, a SOC infrastructure engineer with hands-on experience building systems that matter. I specialize in cloud cost optimization, infrastructure automation, and making complex systems manageable.
            </p>
            <p>
              My approach is practical: build what you need, measure what matters, and never pay for what you don&apos;t use.
            </p>
          </div>
        </section>

        {/* The Story */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}>The $50K Story</h2>
          <div style={{
            lineHeight: 1.8,
            color: 'var(--text-primary)',
            fontSize: '1rem',
          }}>
            <p style={{ marginBottom: '1rem' }}>
              Cost Nimbus isn&apos;t theoretical—it&apos;s built from real results. When I joined my current role, I inherited a cloud environment with massive hidden waste:
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem',
            }}>
              <li style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent-cyan)' }}>•</span>
                $30K/month on an alert management tool that didn&apos;t fit our workflow
              </li>
              <li style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent-cyan)' }}>•</span>
                $20K/month on neglected and underutilized cloud resources
              </li>
              <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent-cyan)' }}>•</span>
                Engineering hours lost to manual cleanup and alert noise
              </li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              I built our own alert management system and automated resource cleanup. The result: <strong>$50,000 in monthly savings</strong> with a payback period of less than one week.
            </p>
            <Link
              href="/article/how-i-saved-50k-month-cloud-costs"
              style={{
                color: 'var(--accent-cyan)',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Read the full case study →
            </Link>
          </div>
        </section>

        {/* Mission */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}>Mission</h2>
          <div style={{
            lineHeight: 1.8,
            color: 'var(--text-primary)',
            fontSize: '1rem',
          }}>
            <p style={{ marginBottom: '1rem' }}>
              Real strategies that work — built by engineers, for engineers.
            </p>
            <p>
              There&apos;s no shortage of cloud cost advice out there. Most of it is vague, theoretical, or comes from vendors trying to sell you something. Cost Nimbus is different: every strategy I share comes from production experience, with real ROI numbers and implementation details you can actually use.
            </p>
          </div>
        </section>

        {/* Connect */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}>Connect</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a
              href="https://github.com/cramir"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                padding: '1rem 1.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Github size={24} style={{ marginRight: '0.75rem' }} />
              <span>github.com/cramir</span>
            </a>
            <a
              href="https://linkedin.com/in/cramir4"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                padding: '1rem 1.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Linkedin size={24} style={{ marginRight: '0.75rem' }} />
              <span>LinkedIn</span>
            </a>
          </div>
        </section>

        {/* Newsletter CTA */}
        <Newsletter wrapInSection={false} />
      </article>

      {/* Footer */}
      <Footer animationDelay="0.4s" />
    </>
  );
}
