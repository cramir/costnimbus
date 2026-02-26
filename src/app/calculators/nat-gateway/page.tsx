'use client';

import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import NewsletterCard from '@/components/newsletter-card';

const NAT_PRICE_PER_HOUR = 0.045;
const NAT_PRICE_PER_GB = 0.045;
const VPC_ENDPOINT_PRICE = 0.01; // per AZ per hour
const S3_GATEWAY_FREE = true;
const DYNAMODB_GATEWAY_FREE = true;

interface Results {
  currentMonthly: number;
  currentHourCost: number;
  currentDataCost: number;
  optimizedMonthly: number;
  vpcEndpointCost: number;
  reducedDataCost: number;
  savings: number;
  savingsPercent: number;
  breakEvenMonths: number;
}

export default function NatGatewayCalculator() {
  const [dataGB, setDataGB] = useState(10000);
  const [azCount, setAzCount] = useState(3);
  const [hoursMonth, setHoursMonth] = useState(730);
  const [s3Traffic, setS3Traffic] = useState(60);    // % going to S3
  const [dynTraffic, setDynTraffic] = useState(15);  // % going to DynamoDB
  const [otherEndpointTraffic, setOtherEndpointTraffic] = useState(10); // % to other services

  const results = useMemo<Results>(() => {
    const currentHourCost = NAT_PRICE_PER_HOUR * azCount * hoursMonth;
    const currentDataCost = NAT_PRICE_PER_GB * dataGB;
    const currentMonthly = currentHourCost + currentDataCost;

    // Optimized: gateway endpoints (S3+DynamoDB) are free, interface endpoints cost per-AZ per hour
    const freeTrafficPct = (s3Traffic + dynTraffic) / 100;
    const interfaceTrafficPct = otherEndpointTraffic / 100;
    const remainingTrafficPct = Math.max(0, 1 - freeTrafficPct - interfaceTrafficPct);

    const vpcEndpointCost = VPC_ENDPOINT_PRICE * azCount * hoursMonth * (interfaceTrafficPct > 0 ? 1 : 0);
    const reducedDataCost = NAT_PRICE_PER_GB * dataGB * remainingTrafficPct;
    const optimizedMonthly = vpcEndpointCost + reducedDataCost;

    const savings = currentMonthly - optimizedMonthly;
    const savingsPercent = (savings / currentMonthly) * 100;

    return {
      currentMonthly,
      currentHourCost,
      currentDataCost,
      optimizedMonthly,
      vpcEndpointCost,
      reducedDataCost,
      savings,
      savingsPercent,
      breakEvenMonths: 0,
    };
  }, [dataGB, azCount, hoursMonth, s3Traffic, dynTraffic, otherEndpointTraffic]);

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt(n);

  return (
    <main className="min-h-screen pt-28 pb-20 calc-main">
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Calculators', href: '/calculators' }, { label: 'NAT Gateway' }]} />
      </div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-4 pb-8 text-center">
        <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full"
          style={{ color: 'var(--accent-cyan)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          Calculator
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          NAT Gateway Cost Calculator
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          See how much you can save by replacing NAT Gateway with VPC endpoints for S3, DynamoDB, and other AWS services.
          Engineers routinely cut 80–91% off their NAT bills.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* Left: Inputs */}
        <div className="space-y-6">
          {/* Current Setup */}
          <div className="rounded-2xl p-[1px]"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(168,85,247,0.3))' }}>
            <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)' }}>
              <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent-cyan)' }}>
                Current Setup
              </div>

              <div className="space-y-6">
                <SliderInput
                  label="Data Transfer Through NAT Gateway"
                  unit="GB/month"
                  value={dataGB}
                  min={100} max={100000} step={100}
                  onChange={setDataGB}
                  hint={`${fmt(dataGB * NAT_PRICE_PER_GB)}/mo at $0.045/GB`}
                />
                <SliderInput
                  label="Number of Availability Zones"
                  unit="AZs"
                  value={azCount}
                  min={1} max={6} step={1}
                  onChange={setAzCount}
                  hint={`${fmt(NAT_PRICE_PER_HOUR * azCount * hoursMonth)}/mo fixed cost`}
                />
                <SliderInput
                  label="Hours per Month"
                  unit="hrs"
                  value={hoursMonth}
                  min={1} max={744} step={1}
                  onChange={setHoursMonth}
                  hint="730 = full month (24×30.4)"
                />
              </div>
            </div>
          </div>

          {/* Traffic Breakdown */}
          <div className="rounded-2xl p-[1px]"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,212,255,0.3))' }}>
            <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)' }}>
              <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent-purple)' }}>
                Traffic Breakdown
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                What percentage of your NAT traffic goes to AWS services? Gateway endpoints (S3, DynamoDB) are free.
              </p>

              <div className="space-y-6">
                <SliderInput
                  label="Traffic to Amazon S3"
                  unit="%"
                  value={s3Traffic}
                  min={0} max={100} step={1}
                  onChange={setS3Traffic}
                  hint="Gateway endpoint → FREE (no data charge)"
                  accentColor="var(--accent-cyan)"
                />
                <SliderInput
                  label="Traffic to DynamoDB"
                  unit="%"
                  value={dynTraffic}
                  min={0} max={100} step={1}
                  onChange={setDynTraffic}
                  hint="Gateway endpoint → FREE (no data charge)"
                  accentColor="var(--accent-cyan)"
                />
                <SliderInput
                  label="Traffic to Other AWS Services"
                  unit="%"
                  value={otherEndpointTraffic}
                  min={0} max={100} step={1}
                  onChange={setOtherEndpointTraffic}
                  hint="Interface endpoints → $0.01/AZ/hr (replaces data cost)"
                  accentColor="var(--accent-purple)"
                />
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Remaining NAT traffic</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {Math.max(0, 100 - s3Traffic - dynTraffic - otherEndpointTraffic)}%
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Still priced at $0.045/GB through NAT
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Diagram */}
          <ArchitectureDiagram
            s3Pct={s3Traffic}
            dynPct={dynTraffic}
            otherPct={otherEndpointTraffic}
            remainPct={Math.max(0, 100 - s3Traffic - dynTraffic - otherEndpointTraffic)}
          />
        </div>

        {/* Right: Results */}
        <div className="space-y-6 lg:sticky lg:top-28">
          {/* Savings Banner */}
          <div className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.08) 100%)',
              border: '1px solid rgba(0,212,255,0.2)',
            }}>
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-cyan)' }} />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-purple)' }} />

            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
                Estimated Monthly Savings
              </div>
              <div className="text-5xl font-extrabold mb-1"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                {fmtK(results.savings)}
              </div>
              <div className="text-2xl font-bold mb-4" style={{ color: '#4ade80' }}>
                {results.savingsPercent.toFixed(0)}% reduction
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {fmtK(results.savings * 12)}/year in avoided NAT costs
              </div>
            </div>
          </div>

          {/* Before/After */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
            <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--border-subtle)' }}>
              <CostColumn
                label="Before"
                total={results.currentMonthly}
                rows={[
                  { label: 'NAT hourly', value: results.currentHourCost },
                  { label: 'Data transfer', value: results.currentDataCost },
                ]}
                color="#ef4444"
                fmt={fmt}
              />
              <CostColumn
                label="After"
                total={results.optimizedMonthly}
                rows={[
                  { label: 'VPC endpoints', value: results.vpcEndpointCost },
                  { label: 'Remaining NAT', value: results.reducedDataCost },
                ]}
                color="#4ade80"
                fmt={fmt}
              />
            </div>
          </div>

          {/* Savings Bar */}
          <div className="rounded-2xl p-6 calc-panel">
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
              Savings Breakdown
            </div>
            <SavingsBar
              s3Pct={s3Traffic} dynPct={dynTraffic}
              otherPct={otherEndpointTraffic}
              remainPct={Math.max(0, 100 - s3Traffic - dynTraffic - otherEndpointTraffic)}
            />
          </div>

          {/* Steps */}
          <div className="rounded-2xl p-6 calc-panel">
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
              How to Get There
            </div>
            <ol className="space-y-3">
              {[
                { step: '1', text: 'Create S3 + DynamoDB Gateway endpoints (free, 2 min)', color: 'var(--accent-cyan)' },
                { step: '2', text: 'Update route tables in each AZ to point to endpoints', color: 'var(--accent-cyan)' },
                { step: '3', text: 'Deploy Interface endpoints for ECR, Secrets Manager, etc.', color: 'var(--accent-purple)' },
                { step: '4', text: 'Monitor flow logs to confirm traffic shift', color: 'var(--accent-purple)' },
              ].map(({ step, text, color }) => (
                <li key={step} className="flex items-start gap-3 text-sm">
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(0,212,255,0.1)', color }}>
                    {step}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA */}
          <NewsletterCTA />
        </div>
      </div>

      {/* Info section */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <InfoCards />
      </section>
    </main>
  );
}

/* ─── Sub-components ─── */

function SliderInput({
  label, unit, value, min, max, step, onChange, hint, accentColor = 'var(--accent-cyan)',
}: {
  label: string; unit: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string; accentColor?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</label>
        <span className="text-sm font-bold font-mono px-3 py-1 rounded-lg"
          style={{ background: 'rgba(0,212,255,0.08)', color: accentColor, border: '1px solid rgba(0,212,255,0.15)' }}>
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
          accentColor,
        }}
      />
      {hint && <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  );
}

function CostColumn({ label, total, rows, color, fmt }: {
  label: string; total: number; rows: { label: string; value: number }[]; color: string; fmt: (n: number) => string;
}) {
  return (
    <div className="p-6">
      <div className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-space-grotesk)', color }}>
        {fmt(total)}
        <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/mo</span>
      </div>
      <div className="space-y-2">
        {rows.map(({ label: l, value }) => (
          <div key={l} className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{l}</span>
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{fmt(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsBar({ s3Pct, dynPct, otherPct, remainPct }: { s3Pct: number; dynPct: number; otherPct: number; remainPct: number }) {
  const items = [
    { label: 'S3 gateway (free)', pct: s3Pct, color: '#4ade80' },
    { label: 'DynamoDB (free)', pct: dynPct, color: '#22d3ee' },
    { label: 'Interface endpoints', pct: otherPct, color: '#a78bfa' },
    { label: 'Remaining NAT', pct: remainPct, color: '#f87171' },
  ];
  return (
    <div>
      <div className="flex rounded-lg overflow-hidden h-4 mb-4">
        {items.map(({ label, pct, color }) => (
          pct > 0 ? <div key={label} style={{ width: `${pct}%`, background: color }} title={`${label}: ${pct}%`} /> : null
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ label, pct, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            <span className="ml-auto font-semibold" style={{ color: 'var(--text-secondary)' }}>{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureDiagram({ s3Pct, dynPct, otherPct, remainPct }: { s3Pct: number; dynPct: number; otherPct: number; remainPct: number }) {
  return (
    <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--text-muted)' }}>
        Optimized Architecture
      </div>
      <div className="space-y-3 text-sm font-mono">
        {/* VPC */}
        <div className="rounded-xl p-4 border-2 border-dashed" style={{ borderColor: 'rgba(0,212,255,0.3)' }}>
          <div className="text-xs font-bold mb-3" style={{ color: 'var(--accent-cyan)' }}>VPC</div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Tag label="EC2 / Lambda" color="var(--text-secondary)" />
            <Tag label="ECS Tasks" color="var(--text-secondary)" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {s3Pct > 0 && <FlowArrow label="→ S3 Gateway" sub="FREE" color="#4ade80" />}
            {dynPct > 0 && <FlowArrow label="→ DynamoDB GW" sub="FREE" color="#4ade80" />}
            {otherPct > 0 && <FlowArrow label="→ Interface EP" sub="$0.01/AZ/hr" color="#a78bfa" />}
            {remainPct > 0 && <FlowArrow label="→ NAT Gateway" sub={`$0.045/GB`} color="#f87171" />}
          </div>
        </div>
        <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          {remainPct === 0 ? '🎉 100% traffic via endpoints — NAT can be removed!' :
            remainPct < 20 ? `✅ ${100 - remainPct}% of traffic avoiding NAT charges` :
              `⚡ ${100 - remainPct}% savings potential identified`}
        </div>
      </div>
    </div>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
      style={{ background: 'rgba(255,255,255,0.05)', color, border: '1px solid var(--border-subtle)' }}>
      {label}
    </span>
  );
}

function FlowArrow({ label, sub, color }: { label: string; sub: string; color: string }) {
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: `${color}15`, border: `1px solid ${color}40` }}>
      <div className="text-xs font-bold" style={{ color }}>{label}</div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  );
}

function InfoCards() {
  const cards = [
    {
      title: 'Gateway Endpoints Are Free',
      body: 'S3 and DynamoDB support Gateway VPC endpoints at zero cost. Traffic routes through AWS\'s private network — no data processing fee, no per-hour charge. This is the lowest-hanging fruit in AWS networking.',
      icon: '🎯',
    },
    {
      title: 'Interface Endpoints Cost Less Than NAT',
      body: 'PrivateLink Interface endpoints cost $0.01/AZ/hr + $0.01/GB. Compare that to NAT Gateway at $0.045/hr + $0.045/GB. For high-volume services like ECR, Secrets Manager, and SSM, endpoints win decisively.',
      icon: '📊',
    },
    {
      title: 'The 91% Savings Scenario',
      body: 'Teams running Kubernetes with ECR image pulls through NAT Gateway routinely see 80–91% savings after optimization. A 10TB/month cluster at $900+/month drops to under $100 with proper endpoint routing.',
      icon: '🚀',
    },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map(({ title, body, icon }) => (
        <div key={title} className="rounded-2xl p-6 calc-panel">
          <div className="text-3xl mb-4">{icon}</div>
          <h3 className="font-bold mb-3" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

function NewsletterCTA() {
  return (
    <NewsletterCard
      headline="More cost cuts in your inbox"
      description="Real savings tactics from engineers who've done it."
    />
  );
}
