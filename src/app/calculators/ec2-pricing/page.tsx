'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb';

// ─── EC2 On-Demand Pricing Data (us-east-1, Linux, Q1 2026) ─────────────────

interface InstanceType {
  name: string;
  family: string;
  vcpus: number;
  ramGB: number;
  onDemand: number;   // $/hour
  spot: number;       // $/hour (avg, varies)
  ri1yrNoUp: number;  // $/hour effective (1yr No Upfront)
  ri1yrPartUp: number;
  ri1yrAllUp: number;
  ri3yrNoUp: number;
  ri3yrAllUp: number;
  note?: string;
}

const INSTANCES: InstanceType[] = [
  // General Purpose - T series (burstable)
  { name: 't3.micro',    family: 'General (T3 Burstable)', vcpus: 2,  ramGB: 1,   onDemand: 0.0104, spot: 0.0032, ri1yrNoUp: 0.0066, ri1yrPartUp: 0.0062, ri1yrAllUp: 0.0060, ri3yrNoUp: 0.0047, ri3yrAllUp: 0.0042 },
  { name: 't3.small',    family: 'General (T3 Burstable)', vcpus: 2,  ramGB: 2,   onDemand: 0.0208, spot: 0.0063, ri1yrNoUp: 0.0132, ri1yrPartUp: 0.0124, ri1yrAllUp: 0.0120, ri3yrNoUp: 0.0093, ri3yrAllUp: 0.0083 },
  { name: 't3.medium',   family: 'General (T3 Burstable)', vcpus: 2,  ramGB: 4,   onDemand: 0.0416, spot: 0.0126, ri1yrNoUp: 0.0263, ri1yrPartUp: 0.0248, ri1yrAllUp: 0.0240, ri3yrNoUp: 0.0186, ri3yrAllUp: 0.0167 },
  { name: 't3.large',    family: 'General (T3 Burstable)', vcpus: 2,  ramGB: 8,   onDemand: 0.0832, spot: 0.0257, ri1yrNoUp: 0.0526, ri1yrPartUp: 0.0497, ri1yrAllUp: 0.0479, ri3yrNoUp: 0.0373, ri3yrAllUp: 0.0333 },
  // General Purpose - M series
  { name: 'm6i.large',   family: 'General (M6i)',           vcpus: 2,  ramGB: 8,   onDemand: 0.0960, spot: 0.0303, ri1yrNoUp: 0.0608, ri1yrPartUp: 0.0571, ri1yrAllUp: 0.0553, ri3yrNoUp: 0.0430, ri3yrAllUp: 0.0384 },
  { name: 'm6i.xlarge',  family: 'General (M6i)',           vcpus: 4,  ramGB: 16,  onDemand: 0.1920, spot: 0.0641, ri1yrNoUp: 0.1216, ri1yrPartUp: 0.1143, ri1yrAllUp: 0.1105, ri3yrNoUp: 0.0860, ri3yrAllUp: 0.0768 },
  { name: 'm6i.2xlarge', family: 'General (M6i)',           vcpus: 8,  ramGB: 32,  onDemand: 0.3840, spot: 0.1258, ri1yrNoUp: 0.2432, ri1yrPartUp: 0.2286, ri1yrAllUp: 0.2211, ri3yrNoUp: 0.1720, ri3yrAllUp: 0.1536 },
  { name: 'm6i.4xlarge', family: 'General (M6i)',           vcpus: 16, ramGB: 64,  onDemand: 0.7680, spot: 0.2525, ri1yrNoUp: 0.4864, ri1yrPartUp: 0.4571, ri1yrAllUp: 0.4421, ri3yrNoUp: 0.3440, ri3yrAllUp: 0.3072 },
  // Compute Optimized
  { name: 'c6i.large',   family: 'Compute (C6i)',           vcpus: 2,  ramGB: 4,   onDemand: 0.0850, spot: 0.0260, ri1yrNoUp: 0.0538, ri1yrPartUp: 0.0506, ri1yrAllUp: 0.0490, ri3yrNoUp: 0.0381, ri3yrAllUp: 0.0340 },
  { name: 'c6i.xlarge',  family: 'Compute (C6i)',           vcpus: 4,  ramGB: 8,   onDemand: 0.1700, spot: 0.0534, ri1yrNoUp: 0.1076, ri1yrPartUp: 0.1013, ri1yrAllUp: 0.0980, ri3yrNoUp: 0.0762, ri3yrAllUp: 0.0680 },
  { name: 'c6i.2xlarge', family: 'Compute (C6i)',           vcpus: 8,  ramGB: 16,  onDemand: 0.3400, spot: 0.1060, ri1yrNoUp: 0.2153, ri1yrPartUp: 0.2025, ri1yrAllUp: 0.1960, ri3yrNoUp: 0.1524, ri3yrAllUp: 0.1360 },
  { name: 'c6i.4xlarge', family: 'Compute (C6i)',           vcpus: 16, ramGB: 32,  onDemand: 0.6800, spot: 0.2126, ri1yrNoUp: 0.4306, ri1yrPartUp: 0.4050, ri1yrAllUp: 0.3920, ri3yrNoUp: 0.3048, ri3yrAllUp: 0.2720 },
  // Memory Optimized
  { name: 'r6i.large',   family: 'Memory (R6i)',            vcpus: 2,  ramGB: 16,  onDemand: 0.1260, spot: 0.0406, ri1yrNoUp: 0.0798, ri1yrPartUp: 0.0751, ri1yrAllUp: 0.0726, ri3yrNoUp: 0.0566, ri3yrAllUp: 0.0505 },
  { name: 'r6i.xlarge',  family: 'Memory (R6i)',            vcpus: 4,  ramGB: 32,  onDemand: 0.2520, spot: 0.0813, ri1yrNoUp: 0.1596, ri1yrPartUp: 0.1502, ri1yrAllUp: 0.1452, ri3yrNoUp: 0.1133, ri3yrAllUp: 0.1010 },
  { name: 'r6i.2xlarge', family: 'Memory (R6i)',            vcpus: 8,  ramGB: 64,  onDemand: 0.5040, spot: 0.1605, ri1yrNoUp: 0.3192, ri1yrPartUp: 0.3005, ri1yrAllUp: 0.2904, ri3yrNoUp: 0.2266, ri3yrAllUp: 0.2021 },
  { name: 'r6i.4xlarge', family: 'Memory (R6i)',            vcpus: 16, ramGB: 128, onDemand: 1.0080, spot: 0.3246, ri1yrNoUp: 0.6384, ri1yrPartUp: 0.6010, ri1yrAllUp: 0.5808, ri3yrNoUp: 0.4531, ri3yrAllUp: 0.4042 },
  // Storage Optimized
  { name: 'i3.large',    family: 'Storage (I3 NVMe)',       vcpus: 2,  ramGB: 15.25, onDemand: 0.1560, spot: 0.0475, ri1yrNoUp: 0.0988, ri1yrPartUp: 0.0929, ri1yrAllUp: 0.0899, ri3yrNoUp: 0.0700, ri3yrAllUp: 0.0624 },
  { name: 'i3.xlarge',   family: 'Storage (I3 NVMe)',       vcpus: 4,  ramGB: 30.5, onDemand: 0.3120, spot: 0.0940, ri1yrNoUp: 0.1977, ri1yrPartUp: 0.1858, ri1yrAllUp: 0.1798, ri3yrNoUp: 0.1400, ri3yrAllUp: 0.1248 },
  // ARM / Graviton
  { name: 'm7g.large',   family: 'General (M7g Graviton3)', vcpus: 2,  ramGB: 8,   onDemand: 0.0816, spot: 0.0260, ri1yrNoUp: 0.0517, ri1yrPartUp: 0.0486, ri1yrAllUp: 0.0470, ri3yrNoUp: 0.0366, ri3yrAllUp: 0.0326, note: 'Graviton3 — best price/perf ratio' },
  { name: 'm7g.xlarge',  family: 'General (M7g Graviton3)', vcpus: 4,  ramGB: 16,  onDemand: 0.1632, spot: 0.0515, ri1yrNoUp: 0.1034, ri1yrPartUp: 0.0972, ri1yrAllUp: 0.0940, ri3yrNoUp: 0.0731, ri3yrAllUp: 0.0653, note: 'Graviton3 — best price/perf ratio' },
  { name: 'c7g.xlarge',  family: 'Compute (C7g Graviton3)', vcpus: 4,  ramGB: 8,   onDemand: 0.1445, spot: 0.0445, ri1yrNoUp: 0.0915, ri1yrPartUp: 0.0861, ri1yrAllUp: 0.0832, ri3yrNoUp: 0.0648, ri3yrAllUp: 0.0578, note: 'Best for compute-heavy, up to 40% cheaper than c6i' },
];

// Group by family
const FAMILIES = [...new Set(INSTANCES.map(i => i.family))];

function fmt(n: number, dp = 2): string {
  if (n >= 10000) return `$${Math.round(n).toLocaleString()}`;
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
}

interface PricingMode {
  key: string;
  label: string;
  color: string;
  description: string;
  bestFor: string;
}

const PRICING_MODES: PricingMode[] = [
  { key: 'onDemand',     label: 'On-Demand',          color: '#f87171', description: 'No commitment. Pay per hour/second.', bestFor: 'Dev/test, short workloads, unpredictable traffic' },
  { key: 'spot',         label: 'Spot',                color: '#facc15', description: 'Up to 90% discount. Can be interrupted.', bestFor: 'Batch, data processing, fault-tolerant workloads' },
  { key: 'ri1yrNoUp',   label: '1yr Reserved (No Up)',  color: '#60a5fa', description: '~36% savings, no upfront payment.', bestFor: 'Predictable workloads, prefer cash flow' },
  { key: 'ri1yrPartUp', label: '1yr Reserved (Part Up)', color: '#34d399', description: '~42% savings, partial upfront.', bestFor: 'Predictable workloads, balanced commitment' },
  { key: 'ri1yrAllUp',  label: '1yr Reserved (All Up)',  color: '#4ade80', description: '~44% savings, all upfront.', bestFor: 'Maximize savings with 1yr commitment' },
  { key: 'ri3yrNoUp',   label: '3yr Reserved (No Up)',  color: '#a78bfa', description: '~55% savings, no upfront.', bestFor: 'Long-term stable workloads' },
  { key: 'ri3yrAllUp',  label: '3yr Reserved (All Up)', color: '#c084fc', description: '~60% savings, all upfront.', bestFor: 'Maximum savings, 3yr commitment' },
];

export default function EC2PricingCalculator() {
  const [selectedFamily, setSelectedFamily] = useState(FAMILIES[0]);
  const [selectedInstance, setSelectedInstance] = useState(INSTANCES[0]);
  const [count, setCount] = useState(3);
  const [hoursPerMonth, setHoursPerMonth] = useState(730);

  const results = useMemo(() => {
    const inst = selectedInstance;

    const modes = PRICING_MODES.map(mode => {
      const rate = inst[mode.key as keyof InstanceType] as number;
      const monthly = rate * hoursPerMonth * count;
      const annual = monthly * 12;
      const savings = Math.max(0, 1 - rate / inst.onDemand);

      // For RI modes, compute upfront costs
      let upfrontCost = 0;
      let totalCostOverTerm = 0;
      if (mode.key === 'ri1yrPartUp') {
        // Approx: ~50% upfront, 50% hourly
        upfrontCost = rate * 730 * 12 * 0.5 * count;
        totalCostOverTerm = upfrontCost + rate * hoursPerMonth * 12 * 0.5 * count;
      } else if (mode.key === 'ri1yrAllUp') {
        upfrontCost = rate * 730 * 12 * count;
        totalCostOverTerm = upfrontCost;
      } else if (mode.key === 'ri3yrAllUp') {
        upfrontCost = rate * 730 * 12 * 3 * count;
        totalCostOverTerm = upfrontCost;
      } else {
        totalCostOverTerm = monthly * (mode.key.includes('3yr') ? 36 : 12);
      }

      return {
        ...mode,
        rate,
        monthly,
        annual,
        savings,
        upfrontCost,
        totalCostOverTerm,
      };
    });

    const onDemandMonthly = modes[0].monthly;
    const breakEven1yr = modes.find(m => m.key === 'ri1yrNoUp');
    const breakEven3yr = modes.find(m => m.key === 'ri3yrNoUp');

    return {
      modes,
      onDemandMonthly,
      spotMonthly: modes[1].monthly,
      ri1yrBestMonthly: modes[3].monthly,  // 1yr all upfront
      ri3yrBestMonthly: modes[6].monthly,  // 3yr all upfront
      maxSavings: Math.max(...modes.map(m => m.savings)),
      annualSavingsVsOnDemand: modes.map(m => ({
        key: m.key,
        label: m.label,
        saving: (onDemandMonthly - m.monthly) * 12,
      })),
    };
  }, [selectedInstance, count, hoursPerMonth]);

  const instancesInFamily = INSTANCES.filter(i => i.family === selectedFamily);

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumb items={[
          { label: 'Calculators', href: '/calculators' },
          { label: 'EC2 Pricing Calculator' },
        ]} />

        {/* Header */}
        <div className="mb-10 mt-6">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
            style={{ color: 'var(--accent-purple)', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
            💰 EC2 Pricing Calculator
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            On-Demand vs Reserved vs Spot
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            See the real cost difference across all EC2 purchasing options. Reserved Instances can cut your bill by 60%+.
            Enter your workload and find the optimal pricing strategy.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: Inputs */}
          <div className="lg:col-span-2 space-y-5">
            {/* Instance Family */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <label className="text-xs font-bold uppercase tracking-widest block mb-3" style={{ color: 'var(--text-muted)' }}>
                Instance Family
              </label>
              <div className="space-y-1.5">
                {FAMILIES.map(fam => (
                  <button key={fam} onClick={() => {
                    setSelectedFamily(fam);
                    const first = INSTANCES.find(i => i.family === fam);
                    if (first) setSelectedInstance(first);
                  }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all font-medium"
                    style={{
                      background: selectedFamily === fam ? 'rgba(168,85,247,0.12)' : 'var(--bg-tertiary)',
                      color: selectedFamily === fam ? 'var(--accent-purple)' : 'var(--text-secondary)',
                      border: `1px solid ${selectedFamily === fam ? 'rgba(168,85,247,0.3)' : 'transparent'}`,
                    }}>
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Instance Size */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <label className="text-xs font-bold uppercase tracking-widest block mb-3" style={{ color: 'var(--text-muted)' }}>
                Instance Size
              </label>
              <div className="space-y-2">
                {instancesInFamily.map(inst => (
                  <button key={inst.name} onClick={() => setSelectedInstance(inst)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: selectedInstance.name === inst.name ? 'rgba(0,212,255,0.08)' : 'var(--bg-tertiary)',
                      border: `1px solid ${selectedInstance.name === inst.name ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                    }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-mono"
                        style={{ color: selectedInstance.name === inst.name ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                        {inst.name}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {fmt(inst.onDemand, 4)}/hr
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {inst.vcpus} vCPU · {inst.ramGB}GB RAM
                      {inst.note && <span className="ml-2" style={{ color: '#4ade80' }}>✓ {inst.note}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Number of Instances
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {count}x
                </span>
              </div>
              <input type="range" min={1} max={100} step={1} value={count} onChange={e => setCount(+e.target.value)}
                className="w-full accent-cyan-400 mb-2" />
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 5, 10, 25].map(v => (
                  <button key={v} onClick={() => setCount(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: count === v ? 'rgba(0,212,255,0.15)' : 'var(--bg-tertiary)',
                      color: count === v ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      border: `1px solid ${count === v ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                    }}>
                    {v}x
                  </button>
                ))}
              </div>
            </div>

            {/* Hours/month */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Hours / Month
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-purple)' }}>
                  {hoursPerMonth}h
                </span>
              </div>
              <input type="range" min={1} max={730} step={1} value={hoursPerMonth} onChange={e => setHoursPerMonth(+e.target.value)}
                className="w-full accent-purple-400 mb-2" />
              <div className="grid grid-cols-3 gap-1.5">
                {[160, 480, 730].map(v => (
                  <button key={v} onClick={() => setHoursPerMonth(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: hoursPerMonth === v ? 'rgba(168,85,247,0.15)' : 'var(--bg-tertiary)',
                      color: hoursPerMonth === v ? 'var(--accent-purple)' : 'var(--text-muted)',
                      border: `1px solid ${hoursPerMonth === v ? 'rgba(168,85,247,0.3)' : 'transparent'}`,
                    }}>
                    {v === 160 ? '20% (dev)' : v === 480 ? '66% (partial)' : '100% (full)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Instance summary */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-cyan)' }}>
                Selected: {selectedInstance.name}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['vCPUs', selectedInstance.vcpus],
                  ['RAM', `${selectedInstance.ramGB}GB`],
                  ['On-Demand', `${fmt(selectedInstance.onDemand, 4)}/hr`],
                  ['Spot (avg)', `${fmt(selectedInstance.spot, 4)}/hr`],
                ].map(([label, val]) => (
                  <div key={String(label)}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </div>
              {selectedInstance.note && (
                <div className="text-xs mt-2" style={{ color: '#4ade80' }}>✓ {selectedInstance.note}</div>
              )}
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            {/* Headline savings */}
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(0,212,255,0.06) 100%)',
                border: '1px solid rgba(168,85,247,0.25)',
              }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: 'var(--accent-purple)' }} />
              <div className="relative grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>On-Demand</div>
                  <div className="text-2xl font-black" style={{ color: '#f87171' }}>{fmt(results.onDemandMonthly)}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>per month</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Spot (avg)</div>
                  <div className="text-2xl font-black" style={{ color: '#facc15' }}>{fmt(results.spotMonthly)}</div>
                  <div className="text-xs" style={{ color: '#facc15' }}>~{Math.round((1 - selectedInstance.spot / selectedInstance.onDemand) * 100)}% off</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>3yr RI (best)</div>
                  <div className="text-2xl font-black" style={{ color: '#c084fc' }}>{fmt(results.ri3yrBestMonthly)}</div>
                  <div className="text-xs" style={{ color: '#c084fc' }}>~{Math.round((1 - selectedInstance.ri3yrAllUp / selectedInstance.onDemand) * 100)}% off</div>
                </div>
              </div>
            </div>

            {/* All pricing modes bar chart */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text-muted)' }}>
                Monthly Cost by Pricing Mode
              </h3>
              <div className="space-y-3">
                {results.modes.map((mode, i) => {
                  const pct = (mode.monthly / results.onDemandMonthly) * 100;
                  return (
                    <div key={mode.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{mode.label}</span>
                        <div className="flex items-center gap-3">
                          {mode.savings > 0 && (
                            <span className="text-xs font-bold" style={{ color: '#4ade80' }}>
                              -{Math.round(mode.savings * 100)}%
                            </span>
                          )}
                          <span className="text-sm font-bold font-mono" style={{ color: mode.color }}>
                            {fmt(mode.monthly)}
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(2, pct)}%`, background: i === 0 ? mode.color : mode.color + 'CC' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Annual savings table */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
                Annual Savings vs On-Demand ({count}x {selectedInstance.name})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {['Pricing Mode', '/hr rate', '/mo', 'Annual', 'Saved/yr'].map(h => (
                        <th key={h} className="pb-3 text-left font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.modes.map((mode, i) => (
                      <tr key={mode.key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td className="py-2.5 font-semibold" style={{ color: mode.color }}>{mode.label}</td>
                        <td className="py-2.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(mode.rate, 4)}</td>
                        <td className="py-2.5 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{fmt(mode.monthly)}</td>
                        <td className="py-2.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(mode.annual)}</td>
                        <td className="py-2.5 font-bold" style={{ color: i === 0 ? 'var(--text-muted)' : '#4ade80' }}>
                          {i === 0 ? '—' : `+${fmt(results.annualSavingsVsOnDemand.find(s => s.key === mode.key)!.saving)}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Decision guide */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
                Which Pricing Mode Should You Use?
              </h3>
              <div className="space-y-3">
                {results.modes.map(mode => (
                  <div key={mode.key} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: mode.color }} />
                    <div>
                      <span className="text-xs font-bold" style={{ color: mode.color }}>{mode.label}: </span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{mode.bestFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro tips */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--accent-cyan)' }}>
                💡 Pro Tips to Maximize Savings
              </h3>
              <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {[
                  { tip: 'Switch to Graviton (arm64)', detail: 'M7g/C7g instances cost 20-40% less than equivalent Intel. Most workloads run without code changes.' },
                  { tip: 'Mix On-Demand + Spot', detail: 'Run 70% baseline as Reserved, 30% burstable as Spot. Spot Fleet handles interruptions automatically.' },
                  { tip: 'Use Compute Savings Plans', detail: 'More flexible than RIs — automatically applies to any EC2 instance family/size/region. Same ~40% discount.' },
                  { tip: 'Buy RIs in the Marketplace', detail: 'AWS Reserved Instance Marketplace lets you buy 1yr RIs with <12 months remaining at a discount.' },
                  { tip: 'Right-size before committing', detail: 'Check CPU/memory utilization with CloudWatch for 2+ weeks before buying Reserved Instances. Committing to an oversized instance wastes money.' },
                ].map(({ tip, detail }) => (
                  <div key={tip} className="flex items-start gap-2">
                    <span style={{ color: 'var(--accent-cyan)' }}>→</span>
                    <div><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{tip}: </span>{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="rounded-2xl p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(168,85,247,0.06) 100%)',
                border: '1px solid rgba(0,212,255,0.15)',
              }}>
              <div className="text-2xl mb-2">📬</div>
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
                EC2 pricing changes. We track it.
              </h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                Get alerts when Reserved Instance prices drop or Savings Plans improve.
              </p>
              <form action="https://sendfox.com/form/3qdz96/36enr2" method="post" target="_blank"
                className="flex flex-col gap-2 max-w-xs mx-auto">
                <input type="email" name="email" placeholder="you@company.com" required
                  className="px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                <button type="submit"
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', color: '#0d1117' }}>
                  Subscribe →
                </button>
              </form>
            </div>

            {/* Pricing notes */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Pricing Notes
              </div>
              <ul className="text-xs space-y-1.5" style={{ color: 'var(--text-muted)' }}>
                <li>• All prices: us-east-1, Linux, on-demand / standard RI pricing</li>
                <li>• Spot prices are 30-day averages — actual prices fluctuate by AZ and time</li>
                <li>• RI pricing shows effective hourly rate (blends upfront + hourly for partial/all upfront)</li>
                <li>• Compute Savings Plans offer similar discounts with more flexibility than shown RIs</li>
                <li>• Windows/RHEL instances cost significantly more — multiply by ~2–4x for licensed OS</li>
                <li>• Data transfer, EBS volumes, and network costs not included</li>
                <li>• Prices updated Q1 2026 — verify at aws.amazon.com/ec2/pricing</li>
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
              { href: '/calculators/cloud-compare', icon: '⚖️', title: 'Cloud Provider Comparison', desc: 'AWS vs Azure vs GCP across all services' },
              { href: '/calculators/serverless', icon: '⚡', title: 'Serverless Cost Calculator', desc: 'Lambda vs Azure Functions vs GCP vs CF Workers' },
              { href: '/calculators/managed-db', icon: '🗃️', title: 'Managed Database Calculator', desc: 'RDS vs Aurora vs PlanetScale vs Neon' },
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
