'use client';

import Link from 'next/link';

export default function HomeContent() {
  return (
    <>
      {/* Cloud decorations */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
      <div className="cloud cloud-4"></div>

      {/* Hero */}
      <section className="hero" style={{
        padding: '10rem 2rem 6rem',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.2s both',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.3rem',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '30px',
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--accent-purple)',
          marginBottom: '2rem',
          animation: 'pulse 3s ease-in-out infinite',
        }}>
          ✓ Trusted by 500+ engineering teams
        </div>

        <h1 style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          Save money on <span style={{
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>cloud costs</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          maxWidth: '650px',
          lineHeight: 1.8,
        }}>
          Real strategies that deliver measurable ROI. Engineering teams save an average of 37% within the first quarter of implementation.
        </p>

        {/* Code block */}
        <div style={{
          background: 'var(--code-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.8rem',
          marginTop: '2rem',
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: '0.8rem',
          overflowX: 'auto',
          position: 'relative',
          boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '1.5rem',
            background: 'var(--bg-tertiary)',
            padding: '0 0.7rem',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-jetbrains-mono)',
          }}>cost-savings.ts</div>
          <pre style={{
            margin: 0,
            padding: 0,
            overflowX: 'auto',
          }}><code style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: '0.8rem',
            lineHeight: 1.8,
            whiteSpace: 'pre',
            color: 'var(--code-text)',
          }}>{`<span class="code-keyword">const</span> <span class="code-function">analyzeSavings</span> = <span class="code-keyword">async</span> () => {
  <span class="code-keyword">const</span> <span class="code-property">metrics</span> = <span class="code-keyword">await</span> <span class="code-function">getCloudMetrics</span>({
    <span class="code-property">timeframe</span>: <span class="code-string">'quarter'</span>,
    <span class="code-property">services</span>: [<span class="code-string">'ec2'</span>, <span class="code-string">'s3'</span>, <span class="code-string">'rds'</span>],
  });

  <span class="code-comment">// Optimization opportunities detected</span>
  <span class="code-keyword">return</span> {
    <span class="code-property">potentialSavings</span>: <span class="code-number">50_000</span>,  <span class="code-comment">// $50k / month</span>
    <span class="code-property">reductionRate</span>: <span class="code-number">0.37</span>,
    <span class="code-property">timeToImpact</span>: <span class="code-string">'2 weeks'</span>,
  };
};`}</code></pre>
        </div>

        {/* Stats cards */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '3rem',
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '180px',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 212, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.3rem',
            }}>$50K+</div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>Avg. Monthly Savings</div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '180px',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 212, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.3rem',
            }}>37%</div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>Reduction Rate</div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '180px',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 212, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.3rem',
            }}>2 weeks</div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>To First Impact</div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section style={{
        padding: '5rem 2rem',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.4s both',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ color: 'var(--accent-cyan)' }}> //</span> Featured Story
          </p>

          <Link href="/article/how-i-saved-50k-month-cloud-costs" style={{
            textDecoration: 'none',
            display: 'block',
          }}>
            <article style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '3rem',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(8px) translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 25px 70px rgba(0, 212, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0) translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <h2 style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '2rem',
                fontWeight: 700,
                lineHeight: 1.25,
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
                position: 'relative',
                zIndex: 1,
              }}>How I Saved $50K/Month in Cloud Costs</h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontFamily: 'var(--font-jetbrains-mono)',
                position: 'relative',
                zIndex: 1,
              }}>
                <span style={{
                  padding: '0.5rem 1.3rem',
                  background: 'rgba(0, 212, 255, 0.1)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>Cloud Cost Optimization</span>
                <span style={{
                  padding: '0.5rem 1.3rem',
                  background: 'rgba(168, 85, 247, 0.1)',
                  color: 'var(--accent-purple)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>15 min read</span>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{
        padding: '6rem 2rem',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.6s both',
      }}>
        <div style={{
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
            fontSize: '2.2rem',
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
          }}>Join thousands of engineers getting practical insights delivered to their inbox. Clear, actionable strategies without the fluff.</p>

          {/* SendFox Form */}
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
              Subscribe ✨
            </button>
          </form>
          <script src="https://cdn.sendfox.com/js/form.js" charSet="utf-8" async></script>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.8s both',
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
