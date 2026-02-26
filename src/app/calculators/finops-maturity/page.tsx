'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb';

// ─── Assessment Data ──────────────────────────────────────────────────────────

interface Option {
  score: number;
  label: string;
  description: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Dimension {
  id: string;
  name: string;
  icon: string;
  color: string;
  questions: Question[];
  recommendations: Record<number, string[]>;
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'visibility',
    name: 'Cost Visibility',
    icon: '👁️',
    color: '#00d4ff',
    questions: [
      {
        id: 'v1',
        text: 'How do you currently monitor cloud spending?',
        options: [
          { score: 1, label: 'Monthly invoice', description: 'We look at the bill when it arrives — or when finance asks' },
          { score: 2, label: 'Basic dashboards', description: 'AWS Cost Explorer or Azure Cost Management is set up, reviewed periodically' },
          { score: 3, label: 'Tagged & sliced', description: 'Resources are tagged; we can break costs by team, service, or environment' },
          { score: 4, label: 'Real-time visibility', description: 'Live dashboards with per-service, per-team, per-environment breakdowns and trending' },
        ],
      },
      {
        id: 'v2',
        text: 'How are cloud costs allocated across teams or products?',
        options: [
          { score: 1, label: 'Not allocated', description: 'Finance handles the total bill — no team-level breakdown exists' },
          { score: 2, label: 'Inconsistent tagging', description: 'Some resources are tagged, but coverage is spotty and unreliable' },
          { score: 3, label: 'Tagging policy in place', description: 'We have a tagging standard and 80%+ of spend is correctly attributed' },
          { score: 4, label: 'Full chargeback/showback', description: '95%+ tagged with automated enforcement; teams receive regular cost reports' },
        ],
      },
      {
        id: 'v3',
        text: 'How quickly do you detect unexpected cost spikes?',
        options: [
          { score: 1, label: 'End of month', description: 'We find out when the bill is unusually high' },
          { score: 2, label: 'Weekly review', description: 'We catch anomalies in weekly or biweekly cost reviews' },
          { score: 3, label: 'Automated alerts', description: 'Cost Anomaly Detection or budget alerts notify us within 24 hours' },
          { score: 4, label: 'Real-time detection', description: 'Automated alerts with runbooks; most anomalies are detected and investigated within hours' },
        ],
      },
    ],
    recommendations: {
      1: [
        'Set up AWS Cost Explorer or Azure Cost Management today — it\'s free',
        'Create a tagging policy: minimum tags should be team, environment, and project',
        'Enable AWS Budgets with a simple total spend alert at 80% and 100%',
        'Schedule a monthly 30-minute cost review meeting with your team lead',
      ],
      2: [
        'Audit tagging coverage using AWS Tag Editor or `aws resourcegroupstaggingapi get-resources`',
        'Set up AWS Cost Anomaly Detection (free) to catch unusual spend',
        'Create Cost Explorer saved reports by service, region, and tag',
        'Assign a "FinOps champion" per team to own their cost visibility',
      ],
      3: [
        'Push toward 95%+ tagging with AWS Config rules enforcing required tags',
        'Build a cost allocation dashboard in Grafana, DataDog, or AWS QuickSight',
        'Set up per-service and per-team budget alerts (not just total account)',
        'Add cost to your weekly engineering standup as a standing agenda item',
      ],
      4: [
        'Explore unit economics: cost per user, cost per transaction, cost per GB processed',
        'Build automated variance reports that explain why costs changed (new resources, scaling events)',
        'Consider open-source tools like OpenCost for Kubernetes-level granularity',
        'Publish a shared cost dashboard that all engineers and leadership can access',
      ],
    },
  },
  {
    id: 'optimization',
    name: 'Optimization',
    icon: '⚡',
    color: '#a855f7',
    questions: [
      {
        id: 'o1',
        text: 'How do you approach right-sizing compute resources?',
        options: [
          { score: 1, label: 'Set and forget', description: 'We provision once and rarely revisit — instances run at whatever size they were launched' },
          { score: 2, label: 'Occasional reviews', description: 'We check Trusted Advisor or Cost Explorer recommendations periodically' },
          { score: 3, label: 'Quarterly right-sizing', description: 'We right-size on a defined schedule using CloudWatch/Performance Insights data' },
          { score: 4, label: 'Continuous optimization', description: 'AWS Compute Optimizer or a third-party tool continuously identifies and remediates over-provisioned resources' },
        ],
      },
      {
        id: 'o2',
        text: 'What is your Reserved Instances / Savings Plans strategy?',
        options: [
          { score: 1, label: 'All On-Demand', description: 'Commitment discounts feel risky — we\'re on On-Demand for everything' },
          { score: 2, label: 'Ad-hoc commitments', description: 'We\'ve bought some RIs but without a formal strategy' },
          { score: 3, label: 'Defined strategy', description: 'We have an RI/SP strategy covering 60%+ of stable compute spend' },
          { score: 4, label: 'Optimized coverage', description: '70%+ coverage, reviewed quarterly, with RI exchange and Marketplace processes' },
        ],
      },
      {
        id: 'o3',
        text: 'How do you handle idle and underutilized resources?',
        options: [
          { score: 1, label: 'No tracking', description: 'We don\'t have visibility into idle resources' },
          { score: 2, label: 'Manual audits', description: 'We do periodic manual reviews to find obvious waste' },
          { score: 3, label: 'Automated flagging', description: 'Automation identifies idle resources (stopped VMs, unused EIPs, old snapshots) and alerts owners' },
          { score: 4, label: 'Automated remediation', description: 'Idle resources are auto-terminated after a review window; waste is tracked as a KPI' },
        ],
      },
    ],
    recommendations: {
      1: [
        'Run AWS Trusted Advisor (free tier) to find obvious right-sizing opportunities',
        'Identify your top 5 cost drivers in Cost Explorer and check their CPU/memory utilization',
        'Start with Compute Savings Plans — they\'re more flexible than RIs and require less analysis',
        'Set up a simple cron job or Lambda to stop non-prod instances after business hours',
      ],
      2: [
        'Enable AWS Compute Optimizer for free right-sizing recommendations across EC2, Lambda, and ECS',
        'Analyze your Savings Plans coverage report — aim for 60%+ on stable compute',
        'Schedule monthly waste reviews: look for EIPs not attached to instances, empty EBS volumes, untagged old snapshots',
        'Use the EC2 Pricing Calculator to model RI vs SP vs On-Demand for your actual usage pattern',
      ],
      3: [
        'Move from quarterly to continuous right-sizing using Compute Optimizer\'s auto-scaling integration',
        'Target 70%+ Savings Plans coverage by analyzing 30-day spend patterns',
        'Automate snapshot lifecycle policies for EBS and RDS — old snapshots are a silent budget leak',
        'Set up Lambda to auto-stop dev/staging environments on a schedule',
      ],
      4: [
        'Explore ARM64/Graviton instances — typically 20% cheaper than x86 equivalents',
        'Consider spot instances for batch workloads, CI/CD, and fault-tolerant services (up to 90% savings)',
        'Review reserved capacity quarterly against your actual workload mix',
        'Track optimization ROI: total identified savings vs. savings actually implemented',
      ],
    },
  },
  {
    id: 'planning',
    name: 'Planning & Forecasting',
    icon: '📊',
    color: '#4ade80',
    questions: [
      {
        id: 'p1',
        text: 'How do you budget for cloud costs?',
        options: [
          { score: 1, label: 'No cloud budget', description: 'Cloud spend is buried in general IT — no cloud-specific budget exists' },
          { score: 2, label: 'Top-down annual budget', description: 'We set an annual number based on last year plus a growth estimate' },
          { score: 3, label: 'Bottom-up per service', description: 'We build forecasts per service/team with growth assumptions and product roadmap input' },
          { score: 4, label: 'Unit economics-driven', description: 'Budgets are tied to business metrics ($/user, $/transaction) and updated as products scale' },
        ],
      },
      {
        id: 'p2',
        text: 'How accurate are your cloud cost forecasts?',
        options: [
          { score: 1, label: 'Not forecasting', description: 'We don\'t forecast, or actuals are often 50%+ over plan' },
          { score: 2, label: '±30–50% accuracy', description: 'Forecasts exist but significant surprises are common' },
          { score: 3, label: '±15% accuracy', description: 'Forecasts are within ±15% in most months with post-hoc analysis' },
          { score: 4, label: '±10% with automation', description: 'Forecasts are within ±10%, with automated variance analysis and root-cause reporting' },
        ],
      },
      {
        id: 'p3',
        text: 'How do you estimate infrastructure costs before deploying?',
        options: [
          { score: 1, label: 'No pre-deploy estimation', description: 'We deploy and see what the bill looks like next month' },
          { score: 2, label: 'Manual estimates', description: 'Engineers ballpark costs for major changes using AWS pricing pages' },
          { score: 3, label: 'Tooling-assisted', description: 'We use Infracost, AWS Pricing Calculator, or similar for pre-deploy cost estimates' },
          { score: 4, label: 'CI/CD integrated', description: 'Every PR shows a cost diff — Infracost or equivalent is part of the standard CI pipeline' },
        ],
      },
    ],
    recommendations: {
      1: [
        'Create a simple cloud budget in AWS Budgets or Azure Cost Management — even a rough number helps',
        'Establish a monthly cost review ritual between engineering and finance',
        'Start tracking cost-per-service in a spreadsheet as a baseline for future forecasting',
        'Use Cost Explorer\'s built-in forecast feature for a rough 12-month projection',
      ],
      2: [
        'Break your annual budget down by service and team to enable more granular tracking',
        'Compare actuals vs forecast monthly — document the reasons for large variances',
        'Model future costs by connecting usage metrics (active users, API calls) to infrastructure costs',
        'Consider using AWS Cost Explorer API to pull actuals into your own reporting tooling',
      ],
      3: [
        'Install Infracost (free, open-source) to get cost estimates in your Terraform/IaC workflows',
        'Build a unit cost dashboard: cost per active user, cost per API call, cost per GB stored',
        'Create a "cost spec" template for new projects — estimated monthly cost must be included in design docs',
        'Use Cost Explorer forecasts as a baseline, then layer in product roadmap adjustments',
      ],
      4: [
        'Integrate Infracost into your GitHub Actions or CI/CD pipeline for automatic PR cost diffs',
        'Define cloud efficiency KPIs and include them in quarterly business reviews',
        'Build anomaly detection into your forecasting model — flag weeks that deviate from trend',
        'Publish a monthly "cloud efficiency report" to leadership with key metrics and trends',
      ],
    },
  },
  {
    id: 'governance',
    name: 'Governance & Policy',
    icon: '🛡️',
    color: '#f59e0b',
    questions: [
      {
        id: 'g1',
        text: 'Do you have cloud budget alerts configured?',
        options: [
          { score: 1, label: 'No alerts', description: 'No budget alerts or thresholds are configured' },
          { score: 2, label: 'Single account alert', description: 'One alert at 80% of the total account budget' },
          { score: 3, label: 'Per-team alerts', description: 'Budget alerts per team or service with automatic notifications to owners' },
          { score: 4, label: 'Automated response', description: 'Alerts trigger automatic remediation (e.g., dev shutdown, ticketing, Slack escalation)' },
        ],
      },
      {
        id: 'g2',
        text: 'How do you enforce tagging and resource policies?',
        options: [
          { score: 1, label: 'No enforcement', description: 'Tagging is voluntary — or there\'s no tagging policy at all' },
          { score: 2, label: 'Policy doc only', description: 'We have a written tagging policy but no technical enforcement' },
          { score: 3, label: 'SCP / Azure Policy', description: 'Service Control Policies or Azure Policy enforce required tags; CI/CD validates before deployment' },
          { score: 4, label: 'Preventive controls', description: 'Automated enforcement prevents untagged resource creation + real-time compliance dashboard' },
        ],
      },
      {
        id: 'g3',
        text: 'How is cloud waste identified and resolved?',
        options: [
          { score: 1, label: 'No process', description: 'Waste is addressed when someone notices or the bill gets too high' },
          { score: 2, label: 'Ad-hoc reviews', description: 'Occasional waste hunts when budget pressure appears' },
          { score: 3, label: 'Monthly reviews', description: 'Scheduled monthly waste review with defined resource owners and action items' },
          { score: 4, label: 'SLA-driven cleanup', description: 'Weekly automated waste report with a 5-business-day SLA for engineers to resolve flagged items' },
        ],
      },
    ],
    recommendations: {
      1: [
        'Set up AWS Budgets immediately — at minimum, a total spend alert at $X × 1.2',
        'Draft a one-page tagging policy: 3–5 required tags, what they mean, and who enforces them',
        'Create a "cloud waste" Slack channel where findings get posted and tracked',
        'Block untagged resource creation with a simple SCP or AWS Config rule',
      ],
      2: [
        'Expand AWS Budgets from account-level to per-service and per-team budgets',
        'Implement an AWS Config rule that flags resources missing required tags',
        'Create a recurring calendar invite for monthly waste reviews with a standard checklist',
        'Define a "resource owner" tag that maps to the on-call rotation or team email',
      ],
      3: [
        'Add Infracost or cost validation to your CI/CD pipeline as a policy gate',
        'Use AWS Service Control Policies (SCPs) to prevent resource creation in unapproved regions',
        'Automate idle resource detection with Lambda + SNS — notify owners before deleting',
        'Create a runbook for common waste types: stopped instances, unused EIPs, stale snapshots',
      ],
      4: [
        'Implement a FinOps "waste score" metric that gets reviewed in quarterly OKRs',
        'Build preventive guardrails for expensive resource types (e.g., require approval for instances > r6g.2xlarge)',
        'Create automated weekly waste emails with one-click "approve deletion" links for resource owners',
        'Conduct quarterly FinOps policy reviews to update limits and thresholds as the business grows',
      ],
    },
  },
  {
    id: 'culture',
    name: 'Culture & Organization',
    icon: '🤝',
    color: '#f43f5e',
    questions: [
      {
        id: 'c1',
        text: 'Who owns FinOps in your organization?',
        options: [
          { score: 1, label: 'Nobody', description: 'Cloud cost responsibility falls to whoever is currently bothered by the bill' },
          { score: 2, label: 'Informal owner', description: 'One person is informally responsible (usually a DevOps/SRE/Cloud lead)' },
          { score: 3, label: 'Dedicated FinOps role', description: 'A Cloud FinOps engineer, cloud economist, or equivalent is formally in the role' },
          { score: 4, label: 'FinOps team + exec sponsor', description: 'Dedicated FinOps practice with executive sponsorship, cross-functional relationships, and a team charter' },
        ],
      },
      {
        id: 'c2',
        text: 'How involved are engineering teams in cost optimization?',
        options: [
          { score: 1, label: 'Not involved', description: 'Engineers view cost as a finance problem — it\'s invisible to them day-to-day' },
          { score: 2, label: 'Reactive involvement', description: 'Engineers are occasionally asked to cut costs when the bill spikes' },
          { score: 3, label: 'Accountable', description: 'Engineers see their team\'s costs in dashboards and discuss them in sprint reviews' },
          { score: 4, label: 'Cost as a feature', description: 'Cost is in sprint planning; optimization work is prioritized alongside features and reliability' },
        ],
      },
      {
        id: 'c3',
        text: 'How do you measure the value of FinOps efforts?',
        options: [
          { score: 1, label: 'Not measured', description: 'We don\'t track what FinOps initiatives save' },
          { score: 2, label: 'Month-over-month spend', description: 'We track total cloud spend and celebrate when it goes down' },
          { score: 3, label: 'Savings tracked', description: 'We track specific optimization actions and the dollars saved from each' },
          { score: 4, label: 'Unit economics + ROI', description: 'We track $/user, $/transaction, cloud efficiency ratios, and FinOps program ROI' },
        ],
      },
    ],
    recommendations: {
      1: [
        'Assign a FinOps champion — even a part-time role with 20% time allocation creates accountability',
        'Add cloud costs to your monthly engineering all-hands as a standing slide',
        'Make cost visible: add a "current monthly cloud spend" widget to your internal engineering dashboard',
        'Celebrate wins publicly: when a team cuts their bill, announce the savings in Slack',
      ],
      2: [
        'Formalize the FinOps role with a job description, dedicated time allocation, and reporting line',
        'Send weekly "team cost digest" emails to engineering leads with their spend vs. prior week',
        'Add cloud cost review to your sprint retrospective template',
        'Create a FinOps Slack channel where wins, ideas, and issues are shared openly',
      ],
      3: [
        'Hire a dedicated Cloud FinOps engineer or formalize the role with a clear career path',
        'Include cloud cost efficiency in engineering performance reviews and OKRs',
        'Build a FinOps champions network across all engineering teams',
        'Present FinOps metrics in quarterly business reviews alongside product metrics',
      ],
      4: [
        'Establish a FinOps Center of Excellence with representation from Engineering, Finance, and Product',
        'Publish monthly unit cost reports to all leadership (cost per active user, cost per GB, etc.)',
        'Share your FinOps journey externally — blog posts, conference talks, open-source tooling',
        'Benchmark against industry unit cost metrics and set improvement targets in annual OKRs',
      ],
    },
  },
];

// ─── Scoring Helpers ──────────────────────────────────────────────────────────

function getMaturityLevel(score: number): { label: string; emoji: string; color: string; desc: string } {
  if (score < 1.75) return { label: 'Crawl', emoji: '🐣', color: '#ef4444', desc: 'You\'re in the early stages of FinOps — big wins are ahead once foundational visibility is in place.' };
  if (score < 2.5) return { label: 'Walk', emoji: '🚶', color: '#f59e0b', desc: 'You have the basics in place. Now it\'s time to systematize and scale your practices.' };
  if (score < 3.25) return { label: 'Run', emoji: '🏃', color: '#4ade80', desc: 'Solid FinOps foundations. You\'re managing costs proactively — focus on automation and culture.' };
  return { label: 'Fly', emoji: '🚀', color: '#00d4ff', desc: 'World-class FinOps. You\'re operating at the highest level of cloud financial management.' };
}

function getDimScore(answers: Record<string, number>, dim: Dimension): number {
  const scores = dim.questions.map(q => answers[q.id] ?? 0).filter(s => s > 0);
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// ─── Components ───────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          DIMENSION {current} OF {total}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{pct}%</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        {DIMENSIONS.map((d, i) => (
          <div key={d.id} style={{ flex: 1, height: '3px', borderRadius: '9999px', background: i < current ? d.color : 'rgba(255,255,255,0.08)', transition: 'background 0.3s ease' }} />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ question, value, onChange }: { question: Question; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.6, fontFamily: 'var(--font-space-grotesk)' }}>
        {question.text}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {question.options.map((opt) => {
          const selected = value === opt.score;
          const levelColors = ['', '#ef4444', '#f59e0b', '#4ade80', '#00d4ff'];
          const levelLabels = ['', '🐣 Crawl', '🚶 Walk', '🏃 Run', '🚀 Fly'];
          return (
            <button
              key={opt.score}
              onClick={() => onChange(opt.score)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: selected ? `${levelColors[opt.score]}12` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selected ? levelColors[opt.score] : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                width: '100%',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${selected ? levelColors[opt.score] : 'rgba(255,255,255,0.2)'}`,
                  background: selected ? levelColors[opt.score] : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: levelColors[opt.score], fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.05em' }}>
                    {levelLabels[opt.score]}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {opt.label}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: Array<{ label: string; icon: string; color: string; value: number }> }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 100;
  const n = scores.length;

  function getPoint(index: number, radius: number): [number, number] {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  }

  const levelRadii = [25, 50, 75, 100];

  const dataPolygon = scores.map((s, i) => getPoint(i, (s.value / 4) * maxR)).map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {/* Grid rings */}
        {levelRadii.map((r, ri) => (
          <polygon key={ri}
            points={Array.from({ length: n }, (_, i) => getPoint(i, r).join(',')).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        {/* Axis lines */}
        {scores.map((_, i) => {
          const [x, y] = getPoint(i, maxR);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
        })}
        {/* Data polygon */}
        <polygon points={dataPolygon} fill="rgba(0,212,255,0.12)" stroke="#00d4ff" strokeWidth={2} strokeLinejoin="round" />
        {/* Data points */}
        {scores.map((s, i) => {
          const [x, y] = getPoint(i, (s.value / 4) * maxR);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={5} fill={s.color} stroke="var(--bg-primary)" strokeWidth={2} />
            </g>
          );
        })}
        {/* Labels */}
        {scores.map((s, i) => {
          const [x, y] = getPoint(i, maxR + 28);
          const anchor = x < cx - 5 ? 'end' : x > cx + 5 ? 'start' : 'middle';
          return (
            <text key={i} x={x} y={y} textAnchor={anchor} style={{ fill: s.color, fontSize: '11px', fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}>
              {s.icon} {s.label}
            </text>
          );
        })}
        {/* Level labels */}
        {['1', '2', '3', '4'].map((label, ri) => (
          <text key={ri} x={cx + 3} y={cy - levelRadii[ri] + 4}
            style={{ fill: 'rgba(255,255,255,0.2)', fontSize: '9px', fontFamily: 'var(--font-jetbrains)' }}>
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ResultsPanel({ answers }: { answers: Record<string, number> }) {
  const dimScores = DIMENSIONS.map(d => ({
    ...d,
    score: getDimScore(answers, d),
  }));

  const overall = dimScores.reduce((a, b) => a + b.score, 0) / dimScores.length;
  const maturity = getMaturityLevel(overall);
  const pct = Math.round(((overall - 1) / 3) * 100);

  const lowestDim = [...dimScores].sort((a, b) => a.score - b.score)[0];

  return (
    <div>
      {/* Score Header */}
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${maturity.color}30`,
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        boxShadow: `0 0 40px ${maturity.color}10`,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{maturity.emoji}</div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-jetbrains)' }}>
          YOUR FINOPS MATURITY
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-space-grotesk)', color: maturity.color, lineHeight: 1 }}>
          {maturity.label}
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem', lineHeight: 1.6 }}>
          {maturity.desc}
        </div>
        {/* Overall score bar */}
        <div style={{ maxWidth: '320px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>Overall Score</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: maturity.color }}>{overall.toFixed(1)} / 4.0</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, #ef4444, #f59e0b, #4ade80, ${maturity.color})`, backgroundSize: '320px 100%', borderRadius: '9999px', transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
            {['🐣 Crawl', '🚶 Walk', '🏃 Run', '🚀 Fly'].map(l => (
              <span key={l} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-jetbrains)' }}>{l.split(' ')[1]}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Maturity by Dimension
        </h3>
        <RadarChart scores={dimScores.map(d => ({ label: d.name.split(' ')[0], icon: d.icon, color: d.color, value: d.score }))} />

        {/* Dimension bars */}
        <div style={{ width: '100%', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {dimScores.map(d => {
            const level = getMaturityLevel(d.score);
            return (
              <div key={d.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.icon} {d.name}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: d.color, fontFamily: 'var(--font-jetbrains)' }}>
                    {d.score.toFixed(1)} — {level.label}
                  </span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((d.score - 1) / 3) * 100}%`, background: d.color, borderRadius: '9999px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Priority */}
      {lowestDim && (
        <div style={{
          background: `${lowestDim.color}08`,
          border: `1px solid ${lowestDim.color}30`,
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{lowestDim.icon}</span>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>TOP PRIORITY</div>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1.1rem', fontWeight: 700, color: lowestDim.color, margin: 0 }}>
                Improve {lowestDim.name}
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {lowestDim.recommendations[Math.round(lowestDim.score) as 1|2|3|4]?.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, fontSize: '0.875rem', color: lowestDim.color, marginTop: '1px' }}>→</span>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Dimension Recommendations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {dimScores.filter(d => d.id !== lowestDim.id).map(d => (
          <details key={d.id} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <summary style={{
              padding: '1.25rem 1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              listStyle: 'none',
              userSelect: 'none',
            }}>
              <span style={{ fontSize: '1.25rem' }}>{d.icon}</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{d.name}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: d.color, fontFamily: 'var(--font-jetbrains)' }}>
                {d.score.toFixed(1)} — {getMaturityLevel(d.score).label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>▼</span>
            </summary>
            <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem' }}>
                {d.recommendations[Math.round(d.score) as 1|2|3|4]?.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, fontSize: '0.875rem', color: d.color, marginTop: '1px' }}>→</span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Resources */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          📚 Related Resources
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { href: '/calculators/ec2-pricing', label: 'EC2 Pricing Calculator', desc: 'Model your RI and Spot savings' },
            { href: '/calculators/managed-db', label: 'Managed Database Calculator', desc: 'RDS vs Aurora vs PlanetScale TCO' },
            { href: '/calculators/nat-gateway', label: 'NAT Gateway Calculator', desc: 'Quantify VPC endpoint savings' },
            { href: '/resources', label: 'FinOps Tools Directory', desc: 'Open-source tools for cost visibility and optimization' },
            { href: '/article/kubernetes-cost-optimization', label: 'Kubernetes Cost Guide', desc: 'OpenCost, VPA, Spot nodes, and more' },
          ].map(r => (
            <Link key={r.href} href={r.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{r.desc}</div>
              </div>
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem', flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(168,85,247,0.08))',
        border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: '20px',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)', marginBottom: '0.75rem' }}>
          WEEKLY FINOPS INSIGHTS
        </div>
        <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Get actionable tips to move up the maturity ladder
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Real FinOps case studies, new calculators, and practical techniques — one email per week.
        </p>
        <Link href="/articles" style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          borderRadius: '10px',
          color: '#0d1117',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
          fontFamily: 'var(--font-space-grotesk)',
        }}>
          Subscribe free →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FinOpsMaturityPage() {
  const [step, setStep] = useState<number>(0); // 0 = intro, 1–5 = dimensions, 6 = results
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentDim = step >= 1 && step <= 5 ? DIMENSIONS[step - 1] : null;

  const dimAnswered = useMemo(() => {
    if (!currentDim) return true;
    return currentDim.questions.every(q => answers[q.id] !== undefined);
  }, [currentDim, answers]);

  const allAnswered = useMemo(() => {
    return DIMENSIONS.every(d => d.questions.every(q => answers[q.id] !== undefined));
  }, [answers]);

  return (
    <main className="calc-main" style={{ minHeight: '100vh', paddingTop: '7rem', paddingBottom: '5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "FinOps Maturity Assessment",
          "description": "Free 15-question assessment that scores your FinOps maturity across 5 dimensions: Visibility, Optimization, Planning, Governance, and Culture. Get actionable recommendations.",
          "url": "https://costnimbus.com/calculators/finops-maturity",
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
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem' }}>
        <Breadcrumb items={[{ label: 'Calculators', href: '/calculators' }, { label: 'FinOps Maturity Assessment' }]} />

        {/* Intro Screen */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.4rem 1.25rem', borderRadius: '9999px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--accent-cyan)', marginBottom: '1.25rem', fontFamily: 'var(--font-jetbrains)' }}>
                FREE ASSESSMENT
              </span>
              <h1 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem', background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                FinOps Maturity Assessment
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 1rem' }}>
                15 questions. 5 dimensions. See exactly where your cloud financial management stands — and what to fix first.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Takes about 3 minutes. No signup required.</p>
            </div>

            {/* Dimensions overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {DIMENSIONS.map(d => (
                <div key={d.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{d.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: d.color }}>{d.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>3 questions</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Maturity levels */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '1.75rem', marginBottom: '2.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                The 4 Maturity Levels
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                  { emoji: '🐣', label: 'Crawl', color: '#ef4444', desc: 'Ad-hoc, reactive, limited visibility' },
                  { emoji: '🚶', label: 'Walk', color: '#f59e0b', desc: 'Defined processes, inconsistent execution' },
                  { emoji: '🏃', label: 'Run', color: '#4ade80', desc: 'Systematic, proactive, measurable' },
                  { emoji: '🚀', label: 'Fly', color: '#00d4ff', desc: 'Automated, data-driven, culture embedded' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem', background: `${l.color}08`, border: `1px solid ${l.color}20`, borderRadius: '12px' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{l.emoji}</span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: l.color, fontFamily: 'var(--font-space-grotesk)' }}>{l.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setStep(1)}
                style={{ padding: '1rem 3rem', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '12px', border: 'none', color: '#0d1117', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.02em' }}>
                Start Assessment →
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Based on the FinOps Foundation maturity model</p>
            </div>
          </div>
        )}

        {/* Dimension Steps */}
        {step >= 1 && step <= 5 && currentDim && (
          <div>
            <ProgressBar current={step} total={5} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '2rem' }}>{currentDim.icon}</span>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }}>
                  DIMENSION {step} OF 5
                </div>
                <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1.6rem', fontWeight: 800, color: currentDim.color, margin: 0 }}>
                  {currentDim.name}
                </h2>
              </div>
            </div>

            {currentDim.questions.map(q => (
              <QuestionCard
                key={q.id}
                question={q}
                value={answers[q.id] ?? 0}
                onChange={v => setAnswers(prev => ({ ...prev, [q.id]: v }))}
              />
            ))}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ padding: '0.875rem 1.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-space-grotesk)' }}>
                ← Back
              </button>
              <button
                onClick={() => step === 5 ? setStep(6) : setStep(s => s + 1)}
                disabled={!dimAnswered}
                style={{ padding: '0.875rem 2rem', background: dimAnswered ? `linear-gradient(135deg, ${currentDim.color}, var(--accent-purple))` : 'rgba(255,255,255,0.04)', border: dimAnswered ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: dimAnswered ? '#0d1117' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.875rem', cursor: dimAnswered ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-space-grotesk)', transition: 'all 0.2s ease' }}>
                {step === 5 ? 'See My Results →' : 'Next Dimension →'}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 6 && (
          <div aria-live="polite" role="region" aria-label="Assessment results">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Your FinOps Assessment
              </h2>
              <button
                onClick={() => { setAnswers({}); setStep(0); }}
                style={{ padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-space-grotesk)', fontWeight: 600 }}>
                Retake Assessment
              </button>
            </div>
            <ResultsPanel answers={answers} />
          </div>
        )}
      </div>
    </main>
  );
}
