'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb';
import NewsletterCard from '@/components/newsletter-card';

// ─── CDN Provider Pricing (Q1 2026) ─────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 10000) return `$${Math.round(n).toLocaleString()}`;
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtBW(gb: number): string {
  if (gb >= 1_000_000) return `${(gb / 1_000_000).toFixed(gb >= 10_000_000 ? 0 : 1)} PB`;
  if (gb >= 1_000) return `${(gb / 1_000).toFixed(gb >= 100_000 ? 0 : 1)} TB`;
  return `${gb} GB`;
}

function fmtReqs(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(n >= 10_000_000_000 ? 0 : 1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

// Log scale helpers
function logSliderToValue(sliderVal: number, min: number, max: number): number {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const logVal = logMin + (sliderVal / 1000) * (logMax - logMin);
  return Math.round(Math.pow(10, logVal));
}

function valueToLogSlider(value: number, min: number, max: number): number {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const logVal = Math.log10(Math.max(value, min));
  return Math.round(((logVal - logMin) / (logMax - logMin)) * 1000);
}

interface CDNResult {
  name: string;
  color: string;
  monthly: number;
  bandwidthCost: number;
  requestCost: number;
  baseCost: number;
  annual: number;
  bestFor: string;
}

function calcCloudFront(bandwidthGB: number, requests: number): CDNResult {
  // Tiered egress pricing
  let bwCost = 0;
  let remaining = bandwidthGB;
  const tiers = [
    { limit: 10_000, rate: 0.085 },
    { limit: 40_000, rate: 0.080 },
    { limit: 150_000, rate: 0.060 },
    { limit: Infinity, rate: 0.040 },
  ];
  for (const tier of tiers) {
    const used = Math.min(remaining, tier.limit);
    bwCost += used * tier.rate;
    remaining -= used;
    if (remaining <= 0) break;
  }

  // HTTPS requests: $0.01 per 10K
  const reqCost = (requests / 10_000) * 0.01;

  // Free tier: 1TB/mo + 10M req/mo (first 12 months, we'll ignore for comparison)
  const total = bwCost + reqCost;

  return {
    name: 'CloudFront (AWS)',
    color: '#FF9900',
    monthly: total,
    bandwidthCost: bwCost,
    requestCost: reqCost,
    baseCost: 0,
    annual: total * 12,
    bestFor: 'Tight AWS integration, Lambda@Edge, global PoPs',
  };
}

function calcCloudflare(bandwidthGB: number, requests: number): CDNResult {
  // Pro plan: $20/mo flat, zero egress, $0.50/million requests above 10M free
  const baseCost = 20;
  const billableRequests = Math.max(0, requests - 10_000_000);
  const reqCost = (billableRequests / 1_000_000) * 0.50;
  const total = baseCost + reqCost;

  return {
    name: 'Cloudflare (Pro)',
    color: '#F6821F',
    monthly: total,
    bandwidthCost: 0,
    requestCost: reqCost,
    baseCost,
    annual: total * 12,
    bestFor: 'Zero egress fees — unbeatable for high-bandwidth',
  };
}

function calcFastly(bandwidthGB: number, requests: number): CDNResult {
  const bwCost = bandwidthGB * 0.12;
  const reqCost = (requests / 10_000) * 0.0075;
  const baseCost = 50;
  const total = Math.max(baseCost, bwCost + reqCost);

  return {
    name: 'Fastly',
    color: '#FF282D',
    monthly: total,
    bandwidthCost: bwCost,
    requestCost: reqCost,
    baseCost,
    annual: total * 12,
    bestFor: 'Real-time config, VCL edge logic, instant purge',
  };
}

function calcBunnyCDN(bandwidthGB: number): CDNResult {
  // Blended rate $0.015/GB (US/EU/Asia mix)
  const bwCost = bandwidthGB * 0.015;
  const baseCost = 1;
  const total = Math.max(baseCost, bwCost);

  return {
    name: 'BunnyCDN',
    color: '#FF8C00',
    monthly: total,
    bandwidthCost: bwCost,
    requestCost: 0,
    baseCost,
    annual: total * 12,
    bestFor: 'Budget champion — cheapest per-GB for small/medium sites',
  };
}

function calcKeyCDN(bandwidthGB: number): CDNResult {
  const bwCost = bandwidthGB * 0.04;
  const total = bwCost;

  return {
    name: 'KeyCDN',
    color: '#1B9CE2',
    monthly: total,
    bandwidthCost: bwCost,
    requestCost: 0,
    baseCost: 0,
    annual: total * 12,
    bestFor: 'Pay-as-you-go, no minimum, simple pricing',
  };
}

function calcAzureCDN(bandwidthGB: number, requests: number): CDNResult {
  // Tiered bandwidth
  let bwCost = 0;
  let remaining = bandwidthGB;
  if (remaining > 10_000) {
    bwCost += 10_000 * 0.087;
    remaining -= 10_000;
    bwCost += remaining * 0.083;
  } else {
    bwCost += remaining * 0.087;
  }

  const reqCost = (requests / 10_000) * 0.009;
  const total = bwCost + reqCost;

  return {
    name: 'Azure CDN (Front Door)',
    color: '#0078D4',
    monthly: total,
    bandwidthCost: bwCost,
    requestCost: reqCost,
    baseCost: 0,
    annual: total * 12,
    bestFor: 'Azure ecosystem, WAF integration, global routing',
  };
}

// Quick-pick presets
const PRESETS = [
  { label: 'Startup', bwGB: 10_000, requests: 500_000_000 },
  { label: 'Mid-size', bwGB: 100_000, requests: 5_000_000_000 },
  { label: 'Enterprise', bwGB: 1_000_000, requests: 50_000_000_000 },
];

export default function CDNCostCalculator() {
  const [bwSlider, setBwSlider] = useState(() => valueToLogSlider(10_000, 1, 1_000_000));
  const [reqSlider, setReqSlider] = useState(() => valueToLogSlider(1_000_000_000, 100_000, 100_000_000_000));
  const [cacheHitRatio, setCacheHitRatio] = useState(85);

  const bandwidthGB = logSliderToValue(bwSlider, 1, 1_000_000);
  const requests = logSliderToValue(reqSlider, 100_000, 100_000_000_000);

  const results = useMemo(() => {
    const providers: CDNResult[] = [
      calcCloudFront(bandwidthGB, requests),
      calcCloudflare(bandwidthGB, requests),
      calcFastly(bandwidthGB, requests),
      calcBunnyCDN(bandwidthGB),
      calcKeyCDN(bandwidthGB),
      calcAzureCDN(bandwidthGB, requests),
    ].sort((a, b) => a.monthly - b.monthly);

    const cheapest = providers[0];
    const cloudfront = providers.find(p => p.name.includes('CloudFront'))!;
    const cloudflare = providers.find(p => p.name.includes('Cloudflare'))!;
    const bunny = providers.find(p => p.name.includes('Bunny'))!;

    // Calculate break-even: where Cloudflare becomes cheaper than CloudFront
    // Cloudflare = $20 + max(0, requests - 10M) * 0.50/M
    // CloudFront = tiered_bw(GB) + requests/10K * 0.01
    // Solve for GB where CloudFront > Cloudflare (roughly)
    let breakEvenGB = 0;
    for (let testGB = 1; testGB <= 1_000_000; testGB *= 1.1) {
      const cfFront = calcCloudFront(Math.round(testGB), requests);
      const cfFlare = calcCloudflare(Math.round(testGB), requests);
      if (cfFront.monthly > cfFlare.monthly) {
        breakEvenGB = Math.round(testGB);
        break;
      }
    }

    return { providers, cheapest, cloudfront, cloudflare, bunny, breakEvenGB };
  }, [bandwidthGB, requests]);

  const maxCost = Math.max(...results.providers.map(p => p.monthly));

  function applyPreset(preset: typeof PRESETS[0]) {
    setBwSlider(valueToLogSlider(preset.bwGB, 1, 1_000_000));
    setReqSlider(valueToLogSlider(preset.requests, 100_000, 100_000_000_000));
  }

  return (
    <main className="min-h-screen pt-28 pb-20 calc-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "CDN Cost Calculator",
          "description": "Compare monthly CDN costs: CloudFront, Cloudflare, Fastly, BunnyCDN, KeyCDN, Azure CDN. See when Cloudflare zero-egress saves you real money.",
          "url": "https://costnimbus.com/calculators/cdn",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "Cost Nimbus",
            "url": "https://costnimbus.com"
          }
        }) }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumb items={[
          { label: 'Calculators', href: '/calculators' },
          { label: 'CDN Cost Calculator' },
        ]} />

        {/* Header */}
        <div className="mb-10 mt-6">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
            style={{ color: 'var(--accent-cyan)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
            🌐 CDN Cost Calculator
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            CloudFront vs Cloudflare vs BunnyCDN
          </h1>
          <p className="text-lg max-w-2xl calc-desc">
            Compare monthly CDN costs across 6 providers. Cloudflare&apos;s zero-egress model
            changes the math at scale — enter your bandwidth and see exactly when.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: Inputs */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick-pick presets */}
            <div className="rounded-2xl p-5 calc-panel">
              <label className="text-xs font-bold uppercase tracking-widest block mb-3" style={{ color: 'var(--text-muted)' }}>
                Quick Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map(preset => (
                  <button key={preset.label} onClick={() => applyPreset(preset)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--accent-cyan)',
                      border: '1px solid rgba(0,212,255,0.2)',
                    }}>
                    <div className="font-bold">{preset.label}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {fmtBW(preset.bwGB)} · {fmtReqs(preset.requests)} req
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Bandwidth */}
            <div className="rounded-2xl p-5 calc-panel">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Monthly Bandwidth
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {fmtBW(bandwidthGB)}
                </span>
              </div>
              <input type="range" min={0} max={1000} step={1} value={bwSlider}
                onChange={e => setBwSlider(+e.target.value)}
                className="w-full accent-cyan-400 mb-2" />
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>1 GB</span>
                <span>1 PB</span>
              </div>
            </div>

            {/* HTTP Requests */}
            <div className="rounded-2xl p-5 calc-panel">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  HTTP Requests / Month
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-purple)' }}>
                  {fmtReqs(requests)}
                </span>
              </div>
              <input type="range" min={0} max={1000} step={1} value={reqSlider}
                onChange={e => setReqSlider(+e.target.value)}
                className="w-full accent-purple-400 mb-2" />
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>100K</span>
                <span>100B</span>
              </div>
            </div>

            {/* Cache Hit Ratio */}
            <div className="rounded-2xl p-5 calc-panel">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Cache Hit Ratio
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {cacheHitRatio}%
                </span>
              </div>
              <input type="range" min={0} max={100} step={1} value={cacheHitRatio}
                onChange={e => setCacheHitRatio(+e.target.value)}
                className="w-full accent-cyan-400 mb-2" />
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 75, 85, 95].map(v => (
                  <button key={v} onClick={() => setCacheHitRatio(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: cacheHitRatio === v ? 'rgba(0,212,255,0.15)' : 'var(--bg-tertiary)',
                      color: cacheHitRatio === v ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      border: `1px solid ${cacheHitRatio === v ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                    }}>
                    {v}%
                  </button>
                ))}
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                Affects origin load. Higher = less origin bandwidth. Typical: 80–95%.
              </p>
            </div>

            {/* Config summary */}
            <div className="rounded-2xl p-5 calc-highlight">
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-cyan)' }}>
                Configuration
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Bandwidth', fmtBW(bandwidthGB)],
                  ['Requests', fmtReqs(requests)],
                  ['Cache Hit', `${cacheHitRatio}%`],
                  ['Origin Load', fmtBW(Math.round(bandwidthGB * (1 - cacheHitRatio / 100)))],
                ].map(([label, val]) => (
                  <div key={String(label)}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            {/* Cloudflare callout */}
            {results.cloudflare.monthly < results.cloudfront.monthly && (
              <div className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(246,130,31,0.08) 0%, rgba(0,212,255,0.06) 100%)',
                  border: '1px solid rgba(246,130,31,0.25)',
                }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: '#F6821F' }} />
                <div className="relative flex items-center gap-4">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <div className="text-sm font-bold mb-1" style={{ color: '#F6821F' }}>
                      Cloudflare saves {fmt(results.cloudfront.monthly - results.cloudflare.monthly)}/mo vs CloudFront
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      At {fmtBW(bandwidthGB)}/mo, Cloudflare&apos;s zero-egress model saves you
                      <span className="font-bold" style={{ color: '#F6821F' }}> {fmt((results.cloudfront.annual - results.cloudflare.annual))}/year</span>.
                      {results.breakEvenGB > 0 && (
                        <> Cloudflare becomes cheaper than CloudFront at ~{fmtBW(results.breakEvenGB)}/mo.</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BunnyCDN callout */}
            {results.bunny.monthly < results.cloudfront.monthly && bandwidthGB <= 100_000 && (
              <div className="rounded-2xl p-4"
                style={{ background: 'rgba(255,140,0,0.04)', border: '1px solid rgba(255,140,0,0.15)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🐰</span>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-bold" style={{ color: '#FF8C00' }}>BunnyCDN budget pick:</span> At {fmtBW(bandwidthGB)}, BunnyCDN costs just {fmt(results.bunny.monthly)}/mo — the cheapest per-GB option for small-to-medium sites with no request fees.
                  </div>
                </div>
              </div>
            )}

            {/* Sorted bar chart */}
            <div className="rounded-2xl p-6 calc-panel">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text-muted)' }}>
                Monthly CDN Cost (sorted cheapest first)
              </h3>
              <div className="space-y-3">
                {results.providers.map((provider, i) => {
                  const pct = maxCost > 0 ? (provider.monthly / maxCost) * 100 : 0;
                  const isCheapest = i === 0;
                  return (
                    <div key={provider.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {isCheapest && <span className="text-sm">🏆</span>}
                          <span className="text-sm font-semibold" style={{ color: isCheapest ? '#4ade80' : 'var(--text-primary)' }}>
                            {provider.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold font-mono" style={{ color: isCheapest ? '#4ade80' : provider.color }}>
                          {fmt(provider.monthly)}/mo
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden calc-bar-bg">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(2, pct)}%`, background: isCheapest ? '#4ade80' : provider.color + 'AA' }} />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        <span>
                          BW: {fmt(provider.bandwidthCost)}
                          {provider.requestCost > 0 && ` · Req: ${fmt(provider.requestCost)}`}
                          {provider.baseCost > 0 && ` · Base: ${fmt(provider.baseCost)}`}
                        </span>
                        <span>{fmt(provider.annual)}/yr</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Annual projection grid */}
            <div className="rounded-2xl p-6 calc-panel">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
                Annual Cost Projection
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {['Provider', 'Bandwidth', 'Requests', 'Base Fee', 'Monthly', 'Annual'].map(h => (
                        <th key={h} className="pb-3 text-left font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.providers.map((p, i) => (
                      <tr key={p.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td className="py-2.5 font-semibold" style={{ color: i === 0 ? '#4ade80' : p.color }}>
                          {i === 0 && '🏆 '}{p.name}
                        </td>
                        <td className="py-2.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(p.bandwidthCost)}</td>
                        <td className="py-2.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(p.requestCost)}</td>
                        <td className="py-2.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(p.baseCost)}</td>
                        <td className="py-2.5 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{fmt(p.monthly)}</td>
                        <td className="py-2.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(p.annual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* When to use guide */}
            <div className="rounded-2xl p-6 calc-panel">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
                When to Use Each Provider
              </h3>
              <div className="space-y-3">
                {results.providers.map(p => (
                  <div key={p.name} className="flex items-start gap-3 p-3 rounded-xl calc-bar-bg">
                    <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: p.color }} />
                    <div>
                      <span className="text-xs font-bold" style={{ color: p.color }}>{p.name}: </span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.bestFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro tips */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--accent-cyan)' }}>
                💡 CDN Optimization Tips
              </h3>
              <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {[
                  { tip: 'Maximize cache hit ratio', detail: 'Set proper Cache-Control headers. Static assets: max-age=31536000,immutable. API: max-age=300,stale-while-revalidate=60.' },
                  { tip: 'Enable compression', detail: 'Brotli/gzip reduces text content by 60–80%. Most CDNs handle this automatically — just ensure your origin allows it.' },
                  { tip: 'Consider multi-CDN', detail: 'Use Cloudflare for bandwidth-heavy assets + CloudFront for AWS-integrated dynamic content. DNS-level switching.' },
                  { tip: 'Negotiate enterprise pricing', detail: 'At 100TB+/mo, all providers offer custom contracts. CloudFront committed pricing can drop to $0.006/GB.' },
                ].map(({ tip, detail }) => (
                  <div key={tip} className="flex items-start gap-2">
                    <span style={{ color: 'var(--accent-cyan)' }}>→</span>
                    <div><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{tip}: </span>{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <NewsletterCard
              headline="CDN pricing changes. We track it."
              description="Get alerts when CDN providers update pricing or launch new tiers."
            />

            {/* Pricing notes */}
            <div className="rounded-2xl p-5 calc-panel">
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Pricing Notes
              </div>
              <ul className="text-xs space-y-1.5" style={{ color: 'var(--text-muted)' }}>
                <li>• CloudFront: US/EU egress pricing shown. Asia/SA/ME costs 20–50% more</li>
                <li>• Cloudflare Pro: $20/mo minimum. Business ($200/mo) and Enterprise (custom) tiers available</li>
                <li>• Fastly: US/EU pricing. $50/mo minimum spend</li>
                <li>• BunnyCDN: Blended rate of $0.015/GB (US/EU $0.01, Asia $0.03)</li>
                <li>• Origin server, compute, and WAF costs not included</li>
                <li>• Prices updated Q1 2026 — verify at provider pricing pages</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-secondary)' }}>
            Related Calculators
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: '/calculators/storage', icon: '🗄️', title: 'S3 vs R2 vs Backblaze', desc: 'Compare object storage costs and egress fees' },
              { href: '/calculators/cloud-compare', icon: '⚖️', title: 'Cloud Provider Comparison', desc: 'AWS vs Azure vs GCP across all services' },
              { href: '/calculators/serverless', icon: '⚡', title: 'Serverless Calculator', desc: 'Lambda vs Azure Functions vs GCP vs CF Workers' },
            ].map(r => (
              <Link key={r.href} href={r.href}
                className="group rounded-xl p-4 flex items-start gap-3 transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <div className="text-sm font-semibold mb-0.5 group-hover:text-cyan-400 transition-colors"
                    style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
