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
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[var(--border-accent)] bg-[var(--accent-glow)]">
            <span className="text-[var(--accent-cyan)] font-semibold text-sm">Tools & Resources</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{
            fontFamily: 'var(--font-space-grotesk)',
            color: 'var(--text-primary)'
          }}>
            SOC Platform Comparison
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.8'
          }}>
            Interactive comparison of 9 leading AI SOC, SOAR, and SIEM platforms.
            Find the right solution for your team&apos;s size, budget, and use case.
          </p>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              color: 'white',
              boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)'
            }}
          >
            {showComparison ? 'Hide' : 'View'} Comparison Matrix
          </button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-6 py-2 rounded-full font-medium transition-all duration-300"
            style={{
              background: selectedCategory === 'all'
                ? 'var(--accent-cyan)'
                : 'var(--bg-card)',
              color: selectedCategory === 'all'
                ? '#0d1117'
                : 'var(--text-secondary)',
              border: selectedCategory === 'all'
                ? 'none'
                : '1px solid var(--border-subtle)',
              boxShadow: selectedCategory === 'all'
                ? '0 0 20px rgba(0, 212, 255, 0.3)'
                : 'none'
            }}
          >
            All Platforms
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="px-6 py-2 rounded-full font-medium transition-all duration-300"
              style={{
                background: selectedCategory === cat.id
                  ? 'var(--accent-cyan)'
                  : 'var(--bg-card)',
                color: selectedCategory === cat.id
                  ? '#0d1117'
                  : 'var(--text-secondary)',
                border: selectedCategory === cat.id
                  ? 'none'
                  : '1px solid var(--border-subtle)',
                boxShadow: selectedCategory === cat.id
                  ? '0 0 20px rgba(0, 212, 255, 0.3)'
                  : 'none'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Comparison Matrix */}
      {showComparison && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)]" style={{
            background: 'var(--bg-card)',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Pricing
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      AI?
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Integrations
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Target Market
                    </th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  {filteredPlatforms.map((platform, index) => (
                    <tr
                      key={platform.name}
                      style={{
                        background: index % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)',
                        transition: 'background-color 0.2s'
                      }}
                      className="hover:bg-[var(--bg-card-hover)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {platform.name}
                          </div>
                          <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {platform.tagline.substring(0, 55)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {platform.category}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {platform.pricing.model}
                        </div>
                        {platform.pricing.starting && (
                          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            {platform.pricing.starting}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {platform.aiCapabilities ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.3)'
                          }}>
                            ✓ Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {platform.integrations}+
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {platform.targetMarket.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Platform Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatforms.map((platform) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              isExpanded={expandedPlatform === platform.name}
              onToggle={() => setExpandedPlatform(
                expandedPlatform === platform.name ? null : platform.name
              )}
            />
          ))}
        </div>
      </section>

      {/* SendFox Email Capture */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl p-8 md:p-12 text-center border" style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1))',
          borderColor: 'var(--border-accent)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h2 className="text-3xl font-bold mb-4" style={{
            fontFamily: 'var(--font-space-grotesk)',
            color: 'var(--text-primary)'
          }}>
            Get the Full SOC Platform Report
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            Detailed analysis of all 9 platforms, including feature comparison, pricing breakdown,
            implementation timelines, and recommendations by team size.
          </p>
          <form
            action="https://sendfox.com/form/3qdz96/36enr2"
            method="post"
            target="_blank"
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 transition"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--accent-cyan)',
                color: '#0d1117',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)'
              }}
            >
              Get Report
            </button>
          </form>
          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* More Tools Coming Soon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl p-12 text-center border border-dashed" style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          opacity: '0.6'
        }}>
          <div className="text-6xl mb-6">🚧</div>
          <h3 className="text-2xl font-bold mb-4" style={{
            fontFamily: 'var(--font-space-grotesk)',
            color: 'var(--text-primary)'
          }}>
            More Tools Coming Soon
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Cloud cost calculator • Savings estimator • Resource optimization analyzer
          </p>
        </div>
      </section>
    </main>
  );
}

function PlatformCard({
  platform,
  isExpanded,
  onToggle
}: {
  platform: Platform;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer border"
      onClick={onToggle}
      style={{
        background: 'var(--bg-card)',
        borderColor: isExpanded ? 'var(--accent-cyan)' : 'var(--border-subtle)',
        boxShadow: isExpanded ? '0 0 30px rgba(0, 212, 255, 0.2)' : 'var(--card-shadow)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1" style={{
            fontFamily: 'var(--font-space-grotesk)',
            color: 'var(--text-primary)'
          }}>
            {platform.name}
          </h3>
          <p className="text-sm font-medium" style={{ color: 'var(--accent-cyan)' }}>
            {platform.category}
          </p>
        </div>
        {platform.aiCapabilities && (
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
            background: 'rgba(0, 212, 255, 0.15)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            AI-Powered
          </span>
        )}
      </div>

      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        {platform.tagline}
      </p>

      <div className="mb-4">
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Pricing
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>{platform.pricing.model}</div>
        {platform.pricing.starting && (
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Starting at {platform.pricing.starting}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Key Strengths
        </div>
        <ul className="space-y-1">
          {platform.strengths.slice(0, isExpanded ? platform.strengths.length : 3).map((strength, i) => (
            <li key={i} className="text-sm flex items-start" style={{ color: 'var(--text-secondary)' }}>
              <span className="mr-2" style={{ color: '#22c55e' }}>✓</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {isExpanded && (
        <div className="mb-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Key Features
          </div>
          <ul className="space-y-1">
            {platform.keyFeatures.map((feature, i) => (
              <li key={i} className="text-sm flex items-start" style={{ color: 'var(--text-secondary)' }}>
                <span className="mr-2" style={{ color: 'var(--accent-cyan)' }}>•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isExpanded && (
        <div className="mb-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Considerations
          </div>
          <ul className="space-y-1">
            {platform.weaknesses.map((weakness, i) => (
              <li key={i} className="text-sm flex items-start" style={{ color: 'var(--text-secondary)' }}>
                <span className="mr-2" style={{ color: '#f59e0b' }}>⚠</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {platform.integrations}+
          </span>{' '}
          integrations
        </div>
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium transition-colors"
          style={{ color: 'var(--accent-cyan)' }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-purple)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
        >
          Visit Site →
        </a>
      </div>
    </div>
  );
}
