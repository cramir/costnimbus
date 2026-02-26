'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb';
import NewsletterCard from '@/components/newsletter-card';

// ─── Pricing Data (Q1 2026) ──────────────────────────────────────────────────

// AWS Lambda pricing (us-east-1)
const LAMBDA = {
  requestPricePer1M: 0.20,          // per 1M requests
  freeTierRequests: 1_000_000,      // 1M free/month
  freeTierGBSeconds: 400_000,       // 400k GB-seconds free/month
  gbSecondPrice_x86: 0.0000166667,  // $/GB-second (x86)
  gbSecondPrice_arm: 0.0000133334,  // $/GB-second (arm64) — 20% cheaper
  provisioned_per_gcus: 0.000004646,// $/provisioned-concurrency-second
  storagePricePerGBSecond: 0.0000000309,
};

// Azure Functions (Consumption Plan)
const AZURE_FUNCTIONS = {
  requestPricePer1M: 0.20,          // same as Lambda
  freeTierRequests: 1_000_000,
  freeTierGBSeconds: 400_000,
  gbSecondPrice: 0.000016,          // $/GB-second
};

// GCP Cloud Functions (2nd Gen / Cloud Run)
const GCP_FUNCTIONS = {
  requestPricePer1M: 0.40,          // $0.40/million (higher than AWS/Azure)
  freeTierRequests: 2_000_000,      // 2M free
  freeTierGBSeconds: 400_000,
  gbSecondPrice: 0.0000025,         // $/vCPU-second (approx, memory billing separate)
  cpuSecondPrice: 0.00001,          // $/CPU-second
  memGBSecondPrice: 0.0000025,      // $/GB-second
};

// Cloudflare Workers
const CF_WORKERS = {
  freeRequests: 100_000,            // 100k free/day = ~3M/month
  paidPlanCost: 5,                  // $5/mo Paid plan
  requestPricePer1M_above: 0.30,    // $0.30/M beyond included
  cpuMsPricePer1M: 0.02,            // $0.02/million CPU-ms (10ms CPU included per request)
  workersDev: true,
};

// Vercel Functions (Pro plan)
const VERCEL = {
  proPlanCost: 20,                  // $20/mo Pro plan (includes generous quota)
  functionInvocations: 1_000_000,   // 1M/month included
  executionUnits: 1_000_000,        // 1M execution units/month included
  overage_per_M_invocations: 0.65,  // $0.65/M extra invocations
};

// Memory options (MB)
const MEMORY_OPTIONS = [128, 256, 512, 1024, 2048, 3008, 4096, 8192, 10240];

function fmt(n: number): string {
  if (n >= 10000) return `$${Math.round(n).toLocaleString()}`;
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtReq(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

interface ProviderResult {
  name: string;
  shortName: string;
  color: string;
  total: number;
  breakdown: { label: string; value: number }[];
  note?: string;
  freeTierNote?: string;
}

interface Results {
  providers: ProviderResult[];
  winner: ProviderResult;
  lambdaArm: ProviderResult;
}

export default function ServerlessCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useState(50_000_000);  // 50M
  const [durationMs, setDurationMs] = useState(250);
  const [memoryMB, setMemoryMB] = useState(512);
  const [arch, setArch] = useState<'x86' | 'arm'>('x86');
  const [includeFree, setIncludeFree] = useState(true);
  const [activeTab, setActiveTab] = useState<'inputs' | 'breakdown'>('inputs');

  const results = useMemo<Results>(() => {
    const requests = requestsPerMonth;
    const durationSec = durationMs / 1000;
    const memoryGB = memoryMB / 1024;
    const gbSeconds = requests * durationSec * memoryGB;

    // ── AWS Lambda (x86) ──
    const lambdaGbSecPrice = arch === 'arm' ? LAMBDA.gbSecondPrice_arm : LAMBDA.gbSecondPrice_x86;
    const lambdaFreeReq = includeFree ? LAMBDA.freeTierRequests : 0;
    const lambdaFreeGB = includeFree ? LAMBDA.freeTierGBSeconds : 0;

    const lambdaReqCost = Math.max(0, requests - lambdaFreeReq) / 1_000_000 * LAMBDA.requestPricePer1M;
    const lambdaComputeCost = Math.max(0, gbSeconds - lambdaFreeGB) * lambdaGbSecPrice;
    const lambdaTotal = lambdaReqCost + lambdaComputeCost;

    // ── AWS Lambda (arm64) ──
    const lambdaArmReqCost = Math.max(0, requests - lambdaFreeReq) / 1_000_000 * LAMBDA.requestPricePer1M;
    const lambdaArmComputeCost = Math.max(0, gbSeconds - lambdaFreeGB) * LAMBDA.gbSecondPrice_arm;
    const lambdaArmTotal = lambdaArmReqCost + lambdaArmComputeCost;

    // ── Azure Functions ──
    const azureFreeReq = includeFree ? AZURE_FUNCTIONS.freeTierRequests : 0;
    const azureFreeGB = includeFree ? AZURE_FUNCTIONS.freeTierGBSeconds : 0;
    const azureReqCost = Math.max(0, requests - azureFreeReq) / 1_000_000 * AZURE_FUNCTIONS.requestPricePer1M;
    const azureComputeCost = Math.max(0, gbSeconds - azureFreeGB) * AZURE_FUNCTIONS.gbSecondPrice;
    const azureTotal = azureReqCost + azureComputeCost;

    // ── GCP Cloud Functions ──
    const gcpFreeReq = includeFree ? GCP_FUNCTIONS.freeTierRequests : 0;
    const gcpFreeGB = includeFree ? GCP_FUNCTIONS.freeTierGBSeconds : 0;
    const gcpReqCost = Math.max(0, requests - gcpFreeReq) / 1_000_000 * GCP_FUNCTIONS.requestPricePer1M;
    const gcpMemCost = Math.max(0, gbSeconds - gcpFreeGB) * GCP_FUNCTIONS.memGBSecondPrice;
    // GCP also charges CPU separately — approx 1 vCPU per GB requested
    const gcpCpuSeconds = requests * durationSec * (memoryGB / 1); // 1vCPU per 1GB (approximation)
    const gcpCpuCost = Math.max(0, gcpCpuSeconds - (includeFree ? 200_000 : 0)) * GCP_FUNCTIONS.cpuSecondPrice;
    const gcpTotal = gcpReqCost + gcpMemCost + gcpCpuCost;

    // ── Cloudflare Workers ──
    const cfFreeReq = includeFree ? CF_WORKERS.freeRequests * 30 : 0; // 100k/day × 30
    const cfBillableReq = Math.max(0, requests - cfFreeReq);
    const cfPlanCost = CF_WORKERS.paidPlanCost; // $5/mo always
    // CPU: 10ms included per request, charge for extra CPU usage
    const cpuMsPerRequest = Math.min(durationMs, 50); // Workers limited to 50ms CPU (approximation)
    const cpuMsTotal = requests * Math.max(0, cpuMsPerRequest - 10); // above 10ms free
    const cfCpuCost = cpuMsTotal / 1_000_000 * CF_WORKERS.cpuMsPricePer1M;
    const cfReqCost = cfBillableReq > 0 ? CF_WORKERS.paidPlanCost + (cfBillableReq / 1_000_000 * CF_WORKERS.requestPricePer1M_above) : CF_WORKERS.paidPlanCost;
    const cfTotal = cfPlanCost + Math.max(0, cfBillableReq / 1_000_000 - 10) * CF_WORKERS.requestPricePer1M_above + cfCpuCost;

    // ── Vercel Functions ──
    const vercelIncludedReq = VERCEL.functionInvocations;
    const vercelExtraReq = Math.max(0, requests - vercelIncludedReq);
    const vercelReqCost = vercelExtraReq / 1_000_000 * VERCEL.overage_per_M_invocations;
    const vercelTotal = VERCEL.proPlanCost + vercelReqCost;

    const lambdaResult: ProviderResult = {
      name: `AWS Lambda (${arch === 'arm' ? 'arm64' : 'x86_64'})`,
      shortName: 'Lambda',
      color: '#FF9900',
      total: arch === 'arm' ? lambdaArmTotal : lambdaTotal,
      breakdown: [
        { label: 'Request charges', value: lambdaReqCost },
        { label: 'Compute (GB-seconds)', value: lambdaComputeCost },
      ],
      freeTierNote: includeFree ? '1M req + 400K GB-sec free/month' : undefined,
    };

    const lambdaArmResult: ProviderResult = {
      name: 'AWS Lambda (arm64)',
      shortName: 'Lambda arm64',
      color: '#FF9900',
      total: lambdaArmTotal,
      breakdown: [
        { label: 'Request charges', value: lambdaArmReqCost },
        { label: 'Compute (GB-seconds)', value: lambdaArmComputeCost },
      ],
      note: '20% cheaper than x86',
      freeTierNote: includeFree ? '1M req + 400K GB-sec free/month' : undefined,
    };

    const azureResult: ProviderResult = {
      name: 'Azure Functions',
      shortName: 'Azure',
      color: '#0078D4',
      total: azureTotal,
      breakdown: [
        { label: 'Request charges', value: azureReqCost },
        { label: 'Compute (GB-seconds)', value: azureComputeCost },
      ],
      freeTierNote: includeFree ? '1M req + 400K GB-sec free/month' : undefined,
    };

    const gcpResult: ProviderResult = {
      name: 'GCP Cloud Functions',
      shortName: 'GCP',
      color: '#4285F4',
      total: gcpTotal,
      breakdown: [
        { label: 'Request charges', value: gcpReqCost },
        { label: 'Memory (GB-seconds)', value: gcpMemCost },
        { label: 'CPU-seconds', value: gcpCpuCost },
      ],
      note: 'Dual billing: CPU + memory separate',
      freeTierNote: includeFree ? '2M req free/month' : undefined,
    };

    const cfResult: ProviderResult = {
      name: 'Cloudflare Workers',
      shortName: 'CF Workers',
      color: '#F48120',
      total: cfTotal,
      breakdown: [
        { label: 'Paid plan', value: CF_WORKERS.paidPlanCost },
        { label: 'Request overages', value: Math.max(0, cfTotal - CF_WORKERS.paidPlanCost - cfCpuCost) },
        { label: 'CPU overages', value: cfCpuCost },
      ],
      note: 'V8 isolates, no cold starts, 50ms CPU limit',
      freeTierNote: includeFree ? '100K req/day free' : undefined,
    };

    const vercelResult: ProviderResult = {
      name: 'Vercel Functions',
      shortName: 'Vercel',
      color: '#000000',
      total: vercelTotal,
      breakdown: [
        { label: 'Pro plan', value: VERCEL.proPlanCost },
        { label: 'Extra invocations', value: vercelReqCost },
      ],
      note: 'Best for Next.js, 1M req/mo included',
      freeTierNote: includeFree ? '1M invocations included in $20/mo plan' : undefined,
    };

    // Sort by total, pick winner
    const allProviders = [lambdaResult, azureResult, gcpResult, cfResult, vercelResult].sort((a, b) => a.total - b.total);

    return {
      providers: allProviders,
      winner: allProviders[0],
      lambdaArm: lambdaArmResult,
    };
  }, [requestsPerMonth, durationMs, memoryMB, arch, includeFree]);

  const maxCost = Math.max(...results.providers.map(p => p.total));

  return (
    <main className="min-h-screen pt-28 pb-20 calc-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Serverless Cost Calculator",
          "description": "Free interactive calculator comparing monthly costs for AWS Lambda, Azure Functions, GCP Cloud Functions, Cloudflare Workers, and Vercel Functions. Real pricing, free tier included.",
          "url": "https://costnimbus.com/calculators/serverless",
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
          { label: 'Serverless Cost Calculator' },
        ]} />

        {/* Header */}
        <div className="mb-10 mt-6">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full calc-badge-cyan">
            ⚡ Serverless Cost Calculator
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            AWS Lambda vs Azure Functions<br />vs GCP vs Cloudflare Workers
          </h1>
          <p className="text-lg max-w-2xl calc-desc">
            Real monthly cost comparison across all major serverless platforms. Enter your workload and see which provider wins for your specific invocation + duration mix.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Inputs */}
          <div className="md:col-span-1 lg:col-span-2 space-y-6">
            {/* Tab bar */}
            <div className="flex rounded-xl p-1 gap-1" style={{ background: 'var(--bg-secondary)' }}>
              {(['inputs', 'breakdown'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  style={{
                    background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                    color: activeTab === tab ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                  }}>
                  {tab === 'inputs' ? '⚙️ Inputs' : '📊 Breakdown'}
                </button>
              ))}
            </div>

            {activeTab === 'inputs' && (
              <div className="space-y-5">
                {/* Requests/month */}
                <div className="rounded-2xl p-5 calc-panel">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-widest calc-text-muted">
                      Requests / Month
                    </label>
                    <span className="text-sm font-bold font-mono calc-text-cyan">
                      {fmtReq(requestsPerMonth)}
                    </span>
                  </div>
                  <input type="range" min={100_000} max={5_000_000_000} step={100_000}
                    value={requestsPerMonth} onChange={e => setRequestsPerMonth(+e.target.value)}
                    className="w-full accent-cyan-400 mb-3"
                    aria-label="Requests per month" />
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1_000_000, 10_000_000, 100_000_000, 1_000_000_000].map(v => (
                      <button key={v} onClick={() => setRequestsPerMonth(v)}
                        className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                        style={{
                          background: requestsPerMonth === v ? 'rgba(0,212,255,0.15)' : 'var(--bg-tertiary)',
                          color: requestsPerMonth === v ? 'var(--accent-cyan)' : 'var(--text-muted)',
                          border: `1px solid ${requestsPerMonth === v ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                        }}>
                        {fmtReq(v)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="rounded-2xl p-5 calc-panel">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-widest calc-text-muted">
                      Avg Duration (ms)
                    </label>
                    <span className="text-sm font-bold font-mono calc-text-purple">
                      {durationMs}ms
                    </span>
                  </div>
                  <input type="range" min={1} max={15000} step={10}
                    value={durationMs} onChange={e => setDurationMs(+e.target.value)}
                    className="w-full accent-purple-400 mb-3"
                    aria-label="Average duration in milliseconds" />
                  <div className="grid grid-cols-4 gap-1.5">
                    {[50, 250, 1000, 5000].map(v => (
                      <button key={v} onClick={() => setDurationMs(v)}
                        className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                        style={{
                          background: durationMs === v ? 'rgba(168,85,247,0.15)' : 'var(--bg-tertiary)',
                          color: durationMs === v ? 'var(--accent-purple)' : 'var(--text-muted)',
                          border: `1px solid ${durationMs === v ? 'rgba(168,85,247,0.3)' : 'transparent'}`,
                        }}>
                        {v}ms
                      </button>
                    ))}
                  </div>
                </div>

                {/* Memory */}
                <div className="rounded-2xl p-5 calc-panel">
                  <label className="text-xs font-bold uppercase tracking-widest block mb-3 calc-text-muted">
                    Memory Allocation
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MEMORY_OPTIONS.slice(0, 6).map(mb => (
                      <button key={mb} onClick={() => setMemoryMB(mb)}
                        className="py-2 text-xs rounded-lg font-semibold transition-all"
                        style={{
                          background: memoryMB === mb ? 'rgba(0,212,255,0.15)' : 'var(--bg-tertiary)',
                          color: memoryMB === mb ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                          border: `1px solid ${memoryMB === mb ? 'rgba(0,212,255,0.3)' : 'var(--border-subtle)'}`,
                        }}>
                        {mb >= 1024 ? `${mb / 1024}GB` : `${mb}MB`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Architecture */}
                <div className="rounded-2xl p-5 calc-panel">
                  <label className="text-xs font-bold uppercase tracking-widest block mb-3 calc-text-muted">
                    Lambda Architecture
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['x86', 'arm'] as const).map(a => (
                      <button key={a} onClick={() => setArch(a)}
                        className="py-3 text-sm rounded-xl font-semibold transition-all"
                        style={{
                          background: arch === a ? 'rgba(0,212,255,0.1)' : 'var(--bg-tertiary)',
                          color: arch === a ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                          border: `1px solid ${arch === a ? 'rgba(0,212,255,0.3)' : 'var(--border-subtle)'}`,
                        }}>
                        {a === 'x86' ? '🖥️ x86_64' : '💪 arm64 (Graviton)'}
                      </button>
                    ))}
                  </div>
                  {arch === 'arm' && (
                    <p className="mt-2 text-xs calc-text-green">
                      ✓ 20% cheaper compute, same free tier
                    </p>
                  )}
                </div>

                {/* Free tier toggle */}
                <div className="rounded-2xl p-5 calc-panel">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold calc-text-primary">Include Free Tier</div>
                      <div className="text-xs mt-0.5 calc-text-muted">AWS/Azure: 1M req + 400K GB-sec free</div>
                    </div>
                    <button onClick={() => setIncludeFree(!includeFree)}
                      className="w-12 h-6 rounded-full transition-all relative"
                      style={{ background: includeFree ? 'var(--accent-cyan)' : 'var(--bg-tertiary)' }}>
                      <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: includeFree ? '28px' : '4px' }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'breakdown' && (
              <div className="space-y-4">
                {results.providers.map((provider, i) => (
                  <div key={provider.name} className="rounded-2xl p-5"
                    style={{ background: 'var(--bg-card)', border: `1px solid ${i === 0 ? provider.color + '40' : 'var(--border-subtle)'}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      {i === 0 && <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: '#4ade8020', color: '#4ade80', border: '1px solid #4ade8040' }}>CHEAPEST</span>}
                      <span className="text-sm font-bold" style={{ color: i === 0 ? provider.color : 'var(--text-primary)' }}>
                        {provider.name}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {provider.breakdown.map(b => (
                        <div key={b.label} className="flex justify-between text-xs">
                          <span className="calc-text-muted">{b.label}</span>
                          <span className="calc-text-secondary">{fmt(b.value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold pt-2 calc-border-top">
                        <span className="calc-text-primary">Total / month</span>
                        <span style={{ color: provider.color }}>{fmt(provider.total)}</span>
                      </div>
                    </div>
                    {provider.note && (
                      <p className="text-xs mt-2 italic calc-text-muted">{provider.note}</p>
                    )}
                    {provider.freeTierNote && (
                      <p className="text-xs mt-1 calc-text-green">✓ {provider.freeTierNote}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div className="md:col-span-1 lg:col-span-3 space-y-6 lg:sticky lg:top-28" aria-live="polite" role="region" aria-label="Calculation results">
            {/* Winner banner */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${results.winner.color}15 0%, ${results.winner.color}08 100%)`,
                border: `1px solid ${results.winner.color}40`,
              }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ background: results.winner.color }} />
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2 calc-text-muted">
                  Cheapest for your workload
                </div>
                <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-space-grotesk)', color: results.winner.color }}>
                  {results.winner.name}
                </div>
                <div className="text-4xl font-black calc-text-primary">
                  {fmt(results.winner.total)}<span className="text-lg font-normal text-secondary ml-1">/mo</span>
                </div>
                {results.winner.note && (
                  <p className="text-sm mt-2 calc-text-secondary">{results.winner.note}</p>
                )}
              </div>
            </div>

            {/* Cost comparison bars */}
            <div className="rounded-2xl p-6 calc-panel">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 calc-text-muted">
                Monthly Cost Comparison
              </h3>
              <div className="space-y-4">
                {results.providers.map((provider, i) => {
                  const pct = maxCost > 0 ? (provider.total / maxCost) * 100 : 100;
                  const savings = i > 0 ? ((provider.total - results.winner.total) / results.winner.total * 100) : 0;
                  return (
                    <div key={provider.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {i === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ background: '#4ade8020', color: '#4ade80', border: '1px solid #4ade8040' }}>CHEAPEST</span>}
                          <span className="text-sm font-semibold calc-text-primary">
                            {provider.shortName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {i > 0 && (
                            <span className="text-xs calc-text-red">
                              +{fmt(provider.total - results.winner.total)}/mo
                            </span>
                          )}
                          <span className="text-sm font-bold font-mono" style={{ color: provider.color }}>
                            {fmt(provider.total)}
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden calc-bar-bg">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(2, pct)}%`, background: i === 0 ? provider.color : `${provider.color}80` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lambda arm64 tip */}
            {arch === 'x86' && (
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <div className="text-sm font-bold mb-1 calc-text-cyan">
                      Switch to arm64 and save {Math.round((1 - results.lambdaArm.total / results.providers.find(p => p.shortName === 'Lambda')!.total) * 100)}%
                    </div>
                    <div className="text-xs calc-text-secondary">
                      Lambda arm64 (Graviton2) costs <strong className="calc-text-primary">{fmt(results.lambdaArm.total)}/mo</strong> vs {fmt(results.providers.find(p => p.shortName === 'Lambda')!.total)}/mo for x86.
                      Same free tier, 20% cheaper compute. Most runtimes are fully supported (Node.js, Python, Java, Go).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Annual projection */}
            <div className="rounded-2xl p-6 calc-panel">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 calc-text-muted">
                Annual Cost Projection
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {results.providers.slice(0, 5).map((p, i) => (
                  <div key={p.name} className="rounded-xl p-3 text-center"
                    style={{
                      background: i === 0 ? `${p.color}10` : 'var(--bg-tertiary)',
                      border: `1px solid ${i === 0 ? p.color + '30' : 'transparent'}`,
                    }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: i === 0 ? p.color : 'var(--text-muted)' }}>
                      {p.shortName}
                    </div>
                    <div className="text-lg font-black" style={{ color: i === 0 ? p.color : 'var(--text-secondary)' }}>
                      {fmt(p.total * 12)}
                    </div>
                    <div className="text-[10px] calc-text-muted">per year</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use case guide */}
            <div className="rounded-2xl p-6 calc-panel">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 calc-text-muted">
                When to Use Each Platform
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'AWS Lambda', color: '#FF9900', icon: '🟠', when: 'Default choice. Best ecosystem, 200+ triggers, richest tooling (SAM, CDK). ARM saves 20% extra.' },
                  { name: 'Azure Functions', color: '#0078D4', icon: '🔵', when: 'Microsoft stack (.NET, C#), existing Azure infra, or Durable Functions for orchestration.' },
                  { name: 'GCP Cloud Functions', color: '#4285F4', icon: '🔵', when: 'BigQuery triggers, GCP-native workloads. Can be more expensive at high volume due to CPU billing.' },
                  { name: 'CF Workers', color: '#F48120', icon: '🟡', when: 'Edge computing, <10ms response, no cold starts. Not ideal for heavy compute (50ms CPU cap).' },
                  { name: 'Vercel Functions', color: '#888', icon: '⚫', when: 'Next.js apps. Seamless DX, included in Pro. Avoid for pure compute workloads.' },
                ].map(item => (
                  <div key={item.name} className="flex items-start gap-3">
                    <span>{item.icon}</span>
                    <div>
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.name}: </span>
                      <span className="text-xs calc-text-secondary">{item.when}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <NewsletterCard
              headline="Get serverless cost alerts"
              description="Pricing changes weekly. We track it so you don't have to."
            />

            {/* Pricing notes */}
            <div className="rounded-2xl p-5 calc-panel">
              <div className="text-xs font-bold uppercase tracking-widest mb-2 calc-text-muted">
                Pricing Notes
              </div>
              <ul className="text-xs space-y-1.5 calc-text-muted">
                <li>• AWS/Azure/GCP: us-east-1 / East US / us-east1 region, on-demand pricing</li>
                <li>• Lambda duration billed in 1ms increments (rounded up)</li>
                <li>• GCP Cloud Functions 2nd Gen: CPU + memory billed separately</li>
                <li>• Cloudflare Workers: $5/mo paid plan required for production; 100k req/day free on free plan</li>
                <li>• Vercel: $20/mo Pro plan includes 1M invocations + 1M execution units</li>
                <li>• Data transfer / API Gateway costs not included</li>
                <li>• Prices updated Q1 2026 — verify before making decisions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related calculators */}
        <section className="mt-16 pt-10 calc-border-top">
          <h2 className="text-lg font-bold mb-5 calc-related-heading">
            Related Calculators
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: '/calculators/cloud-compare', icon: '⚖️', title: 'Cloud Provider Comparison', desc: 'AWS vs Azure vs GCP for compute, storage & egress' },
              { href: '/calculators/managed-db', icon: '🗃️', title: 'Managed Database Calculator', desc: 'RDS vs Aurora vs PlanetScale vs Neon' },
              { href: '/calculators/nat-gateway', icon: '🔀', title: 'NAT Gateway Calculator', desc: 'Save 80–91% with VPC endpoints' },
            ].map(r => (
              <Link key={r.href} href={r.href}
                className="group rounded-xl p-4 flex items-start gap-3 transition-all hover:-translate-y-0.5 calc-panel">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <div className="text-sm font-semibold mb-0.5 group-hover:text-cyan-400 transition-colors calc-text-primary">{r.title}</div>
                  <div className="text-xs calc-text-muted">{r.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
