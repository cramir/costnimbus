'use client';

import { useState } from 'react';
import { platforms, categories, Platform } from '../../data/platforms';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showComparison, setShowComparison] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const filteredPlatforms = selectedCategory === 'all'
    ? platforms
    : platforms.filter(p => {
        const catId = categories.find(c => c.name === p.category)?.id;
        return catId === selectedCategory;
      });

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-16 text-center">
        <span className="inline-block mb-5 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
          style={{
            color: 'var(--accent-cyan)',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            letterSpacing: '0.15em',
          }}>
          Tools &amp; Resources
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          SOC Platform Comparison
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          Interactive comparison of 9 leading AI&nbsp;SOC, SOAR, and SIEM platforms.
          Find the right solution for your team&rsquo;s size, budget, and use case.
        </p>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-[1.03]"
          style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            color: '#0d1117',
            boxShadow: '0 4px 24px rgba(0,212,255,0.25)',
          }}>
          {showComparison ? 'Hide' : 'View'} Comparison Matrix
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </section>

      {/* Category Filters */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap gap-2.5 justify-center">
          {[{ id: 'all', name: 'All Platforms' }, ...categories].map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: active ? 'var(--accent-cyan)' : 'transparent',
                  color: active ? '#0d1117' : 'var(--text-secondary)',
                  border: active ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  boxShadow: active ? '0 0 16px rgba(0,212,255,0.25)' : 'none',
                }}>
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix */}
      {showComparison && (
        <section className="max-w-6xl mx-auto px-6 pb-14">
          <div className="rounded-2xl overflow-hidden" style={{
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(0,212,255,0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {['Platform', 'Category', 'Pricing', 'AI?', 'Integrations', 'Target Market'].map(h => (
                      <th key={h} className="px-5 py-4 text-left font-semibold text-xs uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlatforms.map((p, i) => (
                    <tr key={p.name}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                      <td className="px-5 py-4">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                      </td>
                      <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                      <td className="px-5 py-4">
                        <span style={{ color: 'var(--text-primary)' }}>{p.pricing.model}</span>
                        {p.pricing.starting && (
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.pricing.starting}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {p.aiCapabilities ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                            Yes
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center font-medium" style={{ color: 'var(--text-primary)' }}>{p.integrations}+</td>
                      <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{p.targetMarket.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Platform Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatforms.map((platform) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              isExpanded={expandedPlatform === platform.name}
              onToggle={() => setExpandedPlatform(expandedPlatform === platform.name ? null : platform.name)}
            />
          ))}
        </div>
      </section>

      {/* Email Capture */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <div className="relative rounded-2xl p-10 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(168,85,247,0.06) 100%)',
            border: '1px solid rgba(0,212,255,0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          }}>
          {/* decorative blur */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-cyan)' }} />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-purple)' }} />

          <h2 className="relative text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
            Get the Full SOC Platform Report
          </h2>
          <p className="relative text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Detailed analysis of all 9 platforms — feature comparison, pricing breakdown,
            implementation timelines, and team-size recommendations.
          </p>
          <form action="https://sendfox.com/form/3qdz96/36enr2" method="post" target="_blank"
            className="relative flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input type="email" name="email" placeholder="you@company.com" required
              className="flex-1 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] transition"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
            <button type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.03]"
              style={{ background: 'var(--accent-cyan)', color: '#0d1117' }}>
              Get Report
            </button>
          </form>
          <p className="relative text-xs mt-4" style={{ color: 'var(--text-muted)' }}>No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-2xl p-10 text-center border border-dashed" style={{ borderColor: 'var(--border-subtle)', opacity: 0.5 }}>
          <p className="text-4xl mb-4">🚧</p>
          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
            More Tools Coming Soon
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Cloud cost calculator · Savings estimator · Resource optimization analyzer
          </p>
        </div>
      </section>
    </main>
  );
}

/* ─── Platform Card ─── */
function PlatformCard({ platform, isExpanded, onToggle }: { platform: Platform; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="group relative rounded-2xl p-[1px] cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: isExpanded
          ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))'
          : 'var(--border-subtle)',
      }}
    >
      {/* Inner card */}
      <div className="rounded-2xl p-7 h-full flex flex-col transition-all duration-300"
        style={{
          background: 'var(--bg-card)',
          boxShadow: isExpanded
            ? '0 0 40px rgba(0,212,255,0.12), 0 12px 40px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.15)',
        }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
              {platform.name}
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-cyan)' }}>
              {platform.category}
            </span>
          </div>
          {platform.aiCapabilities && (
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(0,212,255,0.1)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0,212,255,0.25)',
                boxShadow: '0 0 12px rgba(0,212,255,0.1)',
              }}>
              AI-Powered
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {platform.tagline}
        </p>

        {/* Pricing */}
        <div className="mb-5 pb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Pricing</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{platform.pricing.model}</div>
          {platform.pricing.starting && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Starting at {platform.pricing.starting}</div>
          )}
        </div>

        {/* Strengths */}
        <div className="mb-5 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>Key Strengths</div>
          <ul className="space-y-1.5">
            {platform.strengths.slice(0, isExpanded ? undefined : 3).map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: '#4ade80' }}>✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expanded: Features */}
        {isExpanded && (
          <div className="mb-5 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>Key Features</div>
            <ul className="space-y-1.5">
              {platform.keyFeatures.map((f, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: 'var(--accent-cyan)' }}>›</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expanded: Considerations */}
        {isExpanded && (
          <div className="mb-5 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>Considerations</div>
            <ul className="space-y-1.5">
              {platform.weaknesses.map((w, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: '#fbbf24' }}>⚠</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{platform.integrations}+</span> integrations
          </span>
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: 'rgba(0,212,255,0.08)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            Visit Site
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M5 3h8v8M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
