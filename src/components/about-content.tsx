'use client';

import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

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
              I'm Cesar, a SOC infrastructure engineer with hands-on experience building systems that matter. I specialize in cloud cost optimization, infrastructure automation, and making complex systems manageable.
            </p>
            <p>
              My approach is practical: build what you need, measure what matters, and never pay for what you don't use.
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
              Cost Nimbus isn't theoretical—it's built from real results. When I joined my current role, I inherited a cloud environment with massive hidden waste:
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem',
            }}>
              <li style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent-cyan)' }}>•</span>
                $30K/month on an alert management tool that didn't fit our workflow
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
              There's no shortage of cloud cost advice out there. Most of it is vague, theoretical, or comes from vendors trying to sell you something. Cost Nimbus is different: every strategy I share comes from production experience, with real ROI numbers and implementation details you can actually use.
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
              <Github style={{ width: '24px', height: '24px', marginRight: '0.75rem' }} />
              <span>github.com/cramir</span>
            </a>
            <a
              href="https://linkedin.com/in/cramir"
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
              <Linkedin style={{ width: '24px', height: '24px', marginRight: '0.75rem' }} />
              <span>LinkedIn</span>
            </a>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-cyan))',
            borderRadius: '26px',
            zIndex: -1,
            opacity: 0.3,
          }}></div>

          <h2 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--text-primary)',
            position: 'relative',
            zIndex: 1,
          }}>Get weekly cloud cost tips</h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            fontSize: '1rem',
            lineHeight: 1.8,
            position: 'relative',
            zIndex: 1,
          }}>Join engineers saving money on cloud costs. Actionable strategies every Friday.</p>

          <form
            method="post"
            action="https://sendfox.com/form/3qdz96/36enr2"
            className="sendfox-form"
            id="36enr2"
            data-async="true"
            data-recaptcha="true"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <input
              type="text"
              name="first_name"
              placeholder="Your name"
              required
              style={{
                width: '100%',
                padding: '1.1rem 1.5rem',
                fontFamily: 'var(--font-nunito)',
                fontSize: '1rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                transition: 'all 0.3s ease',
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '1.1rem 1.5rem',
                fontFamily: 'var(--font-nunito)',
                fontSize: '1rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                transition: 'all 0.3s ease',
              }}
            />
            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <input type="text" name="a_password" tabIndex={-1} value="" autoComplete="off" />
            </div>
            <button
              type="submit"
              style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '1rem',
                fontWeight: 700,
                padding: '1.2rem 2rem',
                background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 212, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Subscribe (free)
            </button>
          </form>
          <script src="https://cdn.sendfox.com/js/form.js" charSet="utf-8" async></script>
        </section>
      </article>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.4s both',
      }}>
        <p style={{
          fontFamily: 'var(--font-nunito)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>© 2026 Cost Nimbus. Built by engineers, for engineers.</p>
      </footer>
    </>
  );
}
