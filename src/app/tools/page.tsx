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
    <main className="calc-main min-h-screen pt-32 pb-16">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <span className="tools-hero-badge inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full">
          Tools &amp; Resources
        </span>
        <h1 className="tools-hero-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
          SOC Platform Comparison
        </h1>
        <p className="tools-hero-desc text-lg max-w-2xl mx-auto mb-8">
          Interactive comparison of 21 AI&nbsp;SOC, SOAR, and SIEM platforms — from agentless SMB tools to
          enterprise platforms. Find the right solution for your team&rsquo;s size, budget, and use case.
        </p>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="tools-hero-cta group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.03]">
          {showComparison ? 'Hide' : 'View'} Comparison Matrix
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </section>

      {/* Category Filters */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {[{ id: 'all', name: 'All Platforms' }, ...categories].map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${active ? 'tools-filter-active' : 'tools-filter'}`}>
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix */}
      {showComparison && (
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="tools-matrix rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="tools-matrix-header">
                    {['Platform', 'Category', 'Pricing', 'AI?', 'Integrations', 'Target Market'].map(h => (
                      <th key={h} className="tools-matrix-th px-6 py-5 text-left font-semibold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlatforms.map((p, i) => (
                    <tr key={p.name}
                      className={`tools-matrix-row transition-colors ${i % 2 !== 0 ? 'tools-matrix-row-alt' : ''}`}>
                      <td className="px-6 py-5">
                        <span className="tools-card-value font-semibold">{p.name}</span>
                      </td>
                      <td className="tools-card-tagline px-6 py-5">{p.category}</td>
                      <td className="px-6 py-5">
                        <span className="tools-card-value">{p.pricing.model}</span>
                        {p.pricing.starting && (
                          <div className="tools-card-label text-xs mt-1">{p.pricing.starting}</div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {p.aiCapabilities ? (
                          <span className="tools-badge-yes inline-block px-3 py-1 rounded-full text-xs font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="tools-card-label">—</span>
                        )}
                      </td>
                      <td className="tools-card-value px-6 py-5 text-center font-medium">{p.integrations}+</td>
                      <td className="tools-card-tagline px-6 py-5">{p.targetMarket.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Platform Cards */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
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
      <section className="max-w-2xl mx-auto px-6 pt-12 pb-10">
        <div className="tools-email-card relative rounded-3xl p-10 md:p-12 text-center overflow-hidden">
          {/* decorative blur */}
          <div className="tools-email-blur-cyan absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 blur-3xl" />
          <div className="tools-email-blur-purple absolute -bottom-24 -left-24 w-48 h-48 rounded-full opacity-20 blur-3xl" />

          <h2 className="tools-email-heading relative text-2xl md:text-3xl font-bold mb-4">
            Get the Full SOC Platform Report
          </h2>
          <p className="tools-email-desc relative text-base mb-8 max-w-md mx-auto">
            Detailed analysis of all 9 platforms — feature comparison, pricing breakdown,
            implementation timelines, and team-size recommendations.
          </p>
          <form action="https://sendfox.com/form/3qdz96/36enr2" method="post" target="_blank"
            className="relative flex flex-col sm:flex-row gap-4 max-w-sm mx-auto">
            <input type="email" name="email" placeholder="you@company.com" required
              className="tools-email-input flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] transition" />
            <button type="submit"
              className="tools-email-btn px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03]">
              Get Report
            </button>
          </form>
          <p className="tools-card-label relative text-xs mt-6">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="max-w-3xl mx-auto px-6 pt-8 pb-4">
        <div className="tools-coming-soon rounded-2xl p-10 text-center border border-dashed">
          <p className="text-5xl mb-4">&#x1F6A7;</p>
          <h3 className="tools-coming-soon-heading text-xl font-bold mb-2">
            More Tools Coming Soon
          </h3>
          <p className="tools-coming-soon-desc text-sm">
            Cloud cost calculator &middot; Savings estimator &middot; Resource optimization analyzer
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
      className={`group relative rounded-2xl p-[1px] cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isExpanded ? 'tools-card-border-active' : 'tools-card-border'}`}
    >
      {/* Inner card */}
      <div className={`tools-card-inner rounded-2xl p-7 h-full flex flex-col transition-all duration-300 ${isExpanded ? 'tools-card-inner-active' : ''}`}>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="tools-card-heading text-xl font-bold mb-2">
              {platform.name}
            </h3>
            <span className="tools-card-category text-xs font-semibold uppercase tracking-wider">
              {platform.category}
            </span>
          </div>
          {platform.aiCapabilities && (
            <span className="tools-card-ai-badge shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              AI-Powered
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="tools-card-tagline text-sm mb-5 leading-relaxed">
          {platform.tagline}
        </p>

        {/* Pricing */}
        <div className="tools-card-divider mb-4 pb-4">
          <div className="tools-card-label text-[10px] font-bold uppercase tracking-wider mb-2">Pricing</div>
          <div className="tools-card-value text-sm font-semibold">{platform.pricing.model}</div>
          {platform.pricing.starting && (
            <div className="tools-card-label text-xs mt-1">Starting at {platform.pricing.starting}</div>
          )}
        </div>

        {/* Strengths */}
        <div className="mb-4 flex-1">
          <div className="tools-card-label text-[10px] font-bold uppercase tracking-wider mb-3">Key Strengths</div>
          <ul className="space-y-2">
            {platform.strengths.slice(0, isExpanded ? undefined : 3).map((s, i) => (
              <li key={i} className="tools-card-list-item text-sm flex items-start gap-2.5">
                <span className="tools-card-strength-icon mt-0.5 shrink-0">&#x2713;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expanded: Features */}
        {isExpanded && (
          <div className="tools-card-divider-top mb-4 pt-4">
            <div className="tools-card-label text-[10px] font-bold uppercase tracking-wider mb-3">Key Features</div>
            <ul className="space-y-2">
              {platform.keyFeatures.map((f, i) => (
                <li key={i} className="tools-card-list-item text-sm flex items-start gap-2.5">
                  <span className="tools-card-feature-icon mt-0.5 shrink-0">&#x203A;</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expanded: Considerations */}
        {isExpanded && (
          <div className="tools-card-divider-top mb-4 pt-4">
            <div className="tools-card-label text-[10px] font-bold uppercase tracking-wider mb-3">Considerations</div>
            <ul className="space-y-2">
              {platform.weaknesses.map((w, i) => (
                <li key={i} className="tools-card-list-item text-sm flex items-start gap-2.5">
                  <span className="tools-card-warning-icon mt-0.5 shrink-0">&#x26A0;</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="tools-card-divider-top flex items-center justify-between pt-4 mt-auto">
          <span className="tools-card-integrations text-xs">
            <span className="tools-card-integrations-count font-semibold">{platform.integrations}+</span> integrations
          </span>
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="tools-card-visit-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-[1.03]"
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
