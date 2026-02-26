'use client';

import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import Newsletter from './newsletter';

export default function AboutContent() {
  return (
    <>
      {/* Cloud decorations */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
      <div className="cloud cloud-4"></div>

      <article className="page-wrapper">
        <header style={{ marginBottom: '4rem' }}>
          <h1 className="heading-hero">About Cost Nimbus</h1>
          <p className="text-lead">
            Real strategies that work — built by engineers, for engineers
          </p>
        </header>

        {/* Background */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="heading-section">The Engineer</h2>
          <div className="body-text">
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
          <h2 className="heading-section">The $50K Story</h2>
          <div className="body-text">
            <p style={{ marginBottom: '1rem' }}>
              Cost Nimbus isn&apos;t theoretical—it&apos;s built from real results. When I joined my current role, I inherited a cloud environment with massive hidden waste:
            </p>
            <ul className="about-list">
              <li>$30K/month on an alert management tool that didn&apos;t fit our workflow</li>
              <li>$20K/month on neglected and underutilized cloud resources</li>
              <li>Engineering hours lost to manual cleanup and alert noise</li>
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
          <h2 className="heading-section">Mission</h2>
          <div className="body-text">
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
          <h2 className="heading-section">Connect</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a
              href="https://github.com/cramir"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Github size={24} style={{ marginRight: '0.75rem' }} />
              <span>github.com/cramir</span>
            </a>
            <a
              href="https://linkedin.com/in/cramir4"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Linkedin size={24} style={{ marginRight: '0.75rem' }} />
              <span>LinkedIn</span>
            </a>
          </div>
        </section>

        <Newsletter wrapInSection={false} />
      </article>
    </>
  );
}
