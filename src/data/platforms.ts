// SOC Platform Comparison Data
// Source: soc-competitive-analysis.md, soc-company-research.md

export interface Platform {
  name: string;
  category: string;
  tagline: string;
  pricing: {
    model: string;
    starting?: string;
    details?: string;
  };
  targetMarket: string[];
  keyFeatures: string[];
  strengths: string[];
  weaknesses: string[];
  integrations: number;
  deployment: string;
  aiCapabilities: boolean;
  url: string;
}

export const platforms: Platform[] = [
  {
    name: "Prophet Security",
    category: "AI-First SOC Analyst",
    tagline: "Agentic AI SOC Analyst that autonomously triages, investigates, and responds",
    pricing: {
      model: "Subscription (undisclosed)",
      details: "Tiered by investigation volume"
    },
    targetMarket: ["Mid-market", "Small Enterprise"],
    keyFeatures: [
      "Dynamic investigation planning",
      "Autonomous data retrieval & correlation",
      "Severity determination & prioritization",
      "Remediation workflow integration",
      "Real-time SOC metrics dashboard",
      "Human-in-the-loop design"
    ],
    strengths: [
      "90% reduction in investigation time",
      "5-10x productivity gains",
      "Learns from analyst feedback",
      "Clear ROI narrative"
    ],
    weaknesses: [
      "Pricing not transparent",
      "Limited track record vs established vendors",
      "UI could be more modern"
    ],
    integrations: 50,
    deployment: "SaaS",
    aiCapabilities: true,
    url: "https://www.prophetsecurity.ai"
  },
  {
    name: "Dropzone AI",
    category: "AI-First SOC Analyst",
    tagline: "World's First AI SOC Analyst - replicates elite analyst techniques",
    pricing: {
      model: "Subscription",
      starting: "$36,000/year",
      details: "4,000 investigations included"
    },
    targetMarket: ["Mid-market", "Enterprise"],
    keyFeatures: [
      "End-to-end autonomous investigations",
      "Single-tenant architecture",
      "SOC 2 certified",
      "Transparent AI (shows work)",
      "Unlimited 24/7 alert investigation",
      "Detailed investigation reports"
    ],
    strengths: [
      "Deploys in minutes",
      "No playbooks or coding required",
      "Human-in-the-loop design",
      "First-mover advantage"
    ],
    weaknesses: [
      "High starting price",
      "Early-stage company",
      "Limited customer reviews"
    ],
    integrations: 40,
    deployment: "SaaS",
    aiCapabilities: true,
    url: "https://www.dropzone.ai"
  },
  {
    name: "Tines",
    category: "Low-Code SOAR",
    tagline: "Workflow automation platform - no-code security orchestration",
    pricing: {
      model: "Freemium + Paid",
      starting: "$300/month",
      details: "Free tier available"
    },
    targetMarket: ["SMB", "Mid-market"],
    keyFeatures: [
      "Visual workflow builder",
      "No-code automation",
      "Story-based workflows",
      "Real-time collaboration",
      "Extensive integration library",
      "Audit trail & logging"
    ],
    strengths: [
      "Easy to use (no coding)",
      "Free tier for small teams",
      "Expanding beyond security",
      "Strong community"
    ],
    weaknesses: [
      "Not AI-native",
      "Limited SOC-specific features",
      "Manual playbook creation"
    ],
    integrations: 200,
    deployment: "SaaS",
    aiCapabilities: false,
    url: "https://www.tines.com"
  },
  {
    name: "Splunk SOAR",
    category: "Enterprise SOAR",
    tagline: "Industry-leading security orchestration, automation, and response",
    pricing: {
      model: "Enterprise licensing",
      starting: "Contact sales",
      details: "Expensive, complex pricing"
    },
    targetMarket: ["Enterprise", "Large Enterprise"],
    keyFeatures: [
      "Extensive playbook library (300+)",
      "Deep Splunk integration",
      "Advanced case management",
      "Comprehensive reporting",
      "Enterprise-grade security",
      "Professional services available"
    ],
    strengths: [
      "Most mature SOAR platform",
      "Comprehensive feature set",
      "Large ecosystem",
      "Enterprise trust"
    ],
    weaknesses: [
      "Very expensive",
      "Complex implementation",
      "Requires Splunk expertise",
      "Overkill for smaller teams"
    ],
    integrations: 300,
    deployment: "SaaS / On-prem",
    aiCapabilities: false,
    url: "https://www.splunk.com/en_us/products/splunk-soar.html"
  },
  {
    name: "Cortex XSOAR",
    category: "Enterprise SOAR",
    tagline: "Palo Alto Networks security orchestration & automation",
    pricing: {
      model: "Enterprise licensing",
      starting: "Contact sales",
      details: "Expensive, bundled with Cortex"
    },
    targetMarket: ["Enterprise", "Large Enterprise"],
    keyFeatures: [
      "Native Palo Alto integration",
      "Machine learning insights",
      "Threat intelligence management",
      "Incident management",
      "Marketplace with 800+ integrations",
      "DevSecOps integration"
    ],
    strengths: [
      "Strong Palo Alto ecosystem",
      "ML-powered insights",
      "Comprehensive marketplace",
      "Enterprise-grade"
    ],
    weaknesses: [
      "Expensive",
      "Complex implementation",
      "Vendor lock-in",
      "Requires Cortex investment"
    ],
    integrations: 800,
    deployment: "SaaS",
    aiCapabilities: true,
    url: "https://www.paloaltonetworks.com/cortex/cortex-xsoar"
  },
  {
    name: "Wazuh",
    category: "Open-Source SIEM",
    tagline: "Free, open-source security monitoring with SIEM capabilities",
    pricing: {
      model: "Open Source + Enterprise",
      starting: "Free",
      details: "Enterprise tier available"
    },
    targetMarket: ["SMB", "Mid-market", "Budget-conscious"],
    keyFeatures: [
      "Free and open source",
      "SIEM + XDR capabilities",
      "File integrity monitoring",
      "Vulnerability detection",
      "Compliance monitoring",
      "Active community"
    ],
    strengths: [
      "Completely free option",
      "No vendor lock-in",
      "Active community",
      "Comprehensive features"
    ],
    weaknesses: [
      "Complex setup",
      "Requires technical expertise",
      "Limited SOAR capabilities",
      "No AI/ML features"
    ],
    integrations: 100,
    deployment: "On-prem / Cloud",
    aiCapabilities: false,
    url: "https://wazuh.com"
  },
  {
    name: "Microsoft Sentinel",
    category: "Cloud SIEM/SOAR",
    tagline: "Cloud-native SIEM with built-in AI and SOAR",
    pricing: {
      model: "Pay-as-you-go",
      starting: "$2.46/GB",
      details: "Costs scale with data volume"
    },
    targetMarket: ["Microsoft shops", "Enterprise"],
    keyFeatures: [
      "Native Azure integration",
      "Built-in AI/ML",
      "Unified security operations",
      "Cloud-native architecture",
      "Threat intelligence",
      "Automation workflows"
    ],
    strengths: [
      "Seamless Microsoft integration",
      "Built-in AI capabilities",
      "Cloud-native (no infrastructure)",
      "Familiar Microsoft tooling"
    ],
    weaknesses: [
      "Azure-centric",
      "Costs unpredictable",
      "Complex pricing model",
      "Requires Azure expertise"
    ],
    integrations: 400,
    deployment: "Cloud (Azure)",
    aiCapabilities: true,
    url: "https://azure.microsoft.com/en-us/products/microsoft-sentinel"
  },
  {
    name: "CrowdStrike Falcon",
    category: "Cloud XDR/SIEM",
    tagline: "Cloud-native endpoint protection with XDR and SIEM",
    pricing: {
      model: "Subscription",
      starting: "Contact sales",
      details: "Modular pricing by feature"
    },
    targetMarket: ["Mid-market", "Enterprise"],
    keyFeatures: [
      "Native XDR platform",
      "Endpoint detection & response",
      "Threat intelligence",
      "Cloud security",
      "Identity protection",
      "Fusion SOAR"
    ],
    strengths: [
      "Industry-leading endpoint security",
      "Strong threat intelligence",
      "Unified platform",
      "Cloud-native"
    ],
    weaknesses: [
      "Expensive",
      "Endpoint-centric (not full SIEM)",
      "Requires endpoint deployment",
      "Complex licensing"
    ],
    integrations: 300,
    deployment: "Cloud",
    aiCapabilities: true,
    url: "https://www.crowdstrike.com"
  },
  {
    name: "Datadog Security",
    category: "Cloud SIEM",
    tagline: "Cloud-scale monitoring with security analytics",
    pricing: {
      model: "Per-host + data volume",
      starting: "$15/host/month",
      details: "Complex pricing, scales quickly"
    },
    targetMarket: ["Cloud-native", "DevOps-focused"],
    keyFeatures: [
      "Unified observability + security",
      "Cloud-native SIEM",
      "Real-time monitoring",
      "APM integration",
      "Log management",
      "CI/CD security"
    ],
    strengths: [
      "Best for cloud-native teams",
      "Unified monitoring + security",
      "Excellent DevOps integration",
      "Modern architecture"
    ],
    weaknesses: [
      "Not traditional SOC tool",
      "Limited SOAR capabilities",
      "Expensive at scale",
      "New to security market"
    ],
    integrations: 600,
    deployment: "SaaS",
    aiCapabilities: false,
    url: "https://www.datadoghq.com/product/security-platform"
  },
  {
    name: "Elastic Security",
    category: "Open-Source SIEM",
    tagline: "Open-core SIEM and XDR powered by the Elastic Stack",
    pricing: {
      model: "Open Source + Paid",
      starting: "Free (self-hosted)",
      details: "Managed cloud from $95/host/month"
    },
    targetMarket: ["Mid-market", "Enterprise", "Log-analytics-heavy"],
    keyFeatures: [
      "EQL detection language",
      "Machine learning anomaly detection",
      "Cloud-native SIEM",
      "Endpoint security (Elastic Agent)",
      "UEBA and entity analytics",
      "Kubernetes and cloud monitoring"
    ],
    strengths: [
      "Powerful full-text search at scale",
      "Open-source core — no vendor lock-in",
      "Unified observability + security",
      "Strong Kubernetes/DevOps integration"
    ],
    weaknesses: [
      "Elasticsearch is memory-intensive",
      "Steep learning curve for tuning",
      "SOAR features less mature than peers",
      "Index management complexity at scale"
    ],
    integrations: 350,
    deployment: "SaaS / On-prem / Cloud",
    aiCapabilities: true,
    url: "https://www.elastic.co/security"
  },
  {
    name: "IBM QRadar",
    category: "Enterprise SOAR",
    tagline: "Decades-proven enterprise SIEM with AI-powered threat detection",
    pricing: {
      model: "Per-EPS or subscription",
      starting: "Contact sales",
      details: "Complex EPS-based licensing"
    },
    targetMarket: ["Large Enterprise", "Government", "Regulated Industries"],
    keyFeatures: [
      "Behavioral analytics (UEBA)",
      "Network flow analysis",
      "Asset discovery and profiling",
      "Case management and ticketing",
      "900+ DSM integrations",
      "FedRAMP authorized"
    ],
    strengths: [
      "Mature, battle-tested platform",
      "Strong compliance tooling (PCI, HIPAA)",
      "On-prem and air-gapped deployments",
      "IBM threat intelligence feed"
    ],
    weaknesses: [
      "Legacy UI — modernization ongoing",
      "EPS licensing sticker shock",
      "Heavy infrastructure requirements",
      "Slow to adopt modern cloud patterns"
    ],
    integrations: 900,
    deployment: "On-prem / SaaS",
    aiCapabilities: true,
    url: "https://www.ibm.com/qradar"
  },
  {
    name: "Securonix",
    category: "Cloud SIEM/SOAR",
    tagline: "Cloud-native SIEM + UEBA with analytics-driven threat detection",
    pricing: {
      model: "Subscription",
      starting: "Contact sales",
      details: "Per-EPS or data volume tiers"
    },
    targetMarket: ["Mid-market", "Enterprise", "Financial Services"],
    keyFeatures: [
      "UEBA at core (not bolt-on)",
      "SPOT (Securonix Threat Research) intelligence",
      "Automated threat hunting",
      "Snowflake-based architecture",
      "Infinite retention options",
      "Unified SIEM + SOAR + NTA"
    ],
    strengths: [
      "UEBA is genuinely best-in-class",
      "Cloud-native from the ground up",
      "Low-latency at petabyte scale",
      "Strong financial services coverage"
    ],
    weaknesses: [
      "Pricing not transparent",
      "Smaller ecosystem vs Splunk",
      "Professional services often required",
      "Integration depth varies"
    ],
    integrations: 500,
    deployment: "Cloud (SaaS)",
    aiCapabilities: true,
    url: "https://www.securonix.com"
  },
  {
    name: "Vectra AI",
    category: "AI-First SOC Analyst",
    tagline: "AI-driven Network Detection & Response — attackers can't hide",
    pricing: {
      model: "Subscription",
      starting: "Contact sales",
      details: "Per-host or bandwidth-based"
    },
    targetMarket: ["Mid-market", "Enterprise"],
    keyFeatures: [
      "Patented Attack Signal Intelligence™",
      "Network traffic analysis (NTA)",
      "AI-detected lateral movement",
      "Hybrid cloud coverage (Azure, AWS)",
      "Identity threat detection (Active Directory)",
      "Real-time entity scoring"
    ],
    strengths: [
      "Best-in-class NDR detection",
      "Low false positive rates",
      "Catches attacks inside the perimeter",
      "Strong Azure + Office 365 coverage"
    ],
    weaknesses: [
      "Not a full SIEM replacement",
      "Log ingestion less mature than peers",
      "Requires complementary SIEM",
      "Pricing opaque"
    ],
    integrations: 150,
    deployment: "SaaS / On-prem",
    aiCapabilities: true,
    url: "https://www.vectra.ai"
  },
  {
    name: "Google Chronicle SIEM",
    category: "Cloud SIEM/SOAR",
    tagline: "Google-scale threat detection — petabytes of logs, flat pricing",
    pricing: {
      model: "Flat-rate subscription",
      starting: "Contact sales",
      details: "Fixed price regardless of data volume"
    },
    targetMarket: ["Enterprise", "Large Enterprise"],
    keyFeatures: [
      "Flat-rate pricing (no per-GB shock)",
      "Petabyte-scale log retention",
      "YARA-L detection language",
      "VirusTotal and Google threat intelligence",
      "UDM (Unified Data Model)",
      "Native Google Cloud integration"
    ],
    strengths: [
      "No data volume pricing anxiety",
      "Google threat intelligence built-in",
      "Massive scale without performance degradation",
      "1-year hot retention included"
    ],
    weaknesses: [
      "Google Cloud vendor lock-in",
      "SOAR/UEBA features still maturing",
      "Smaller partner ecosystem vs Splunk",
      "Implementation requires expertise"
    ],
    integrations: 700,
    deployment: "Cloud (Google Cloud)",
    aiCapabilities: true,
    url: "https://chronicle.security"
  },
  // ── Newly Added Platforms ────────────────────────────────────────────────
  {
    name: "Sumo Logic",
    category: "Cloud SIEM/SOAR",
    tagline: "Cloud-native SIEM with continuous intelligence — built for modern DevSecOps",
    pricing: {
      model: "Credits-based (per GB ingested)",
      starting: "$~3/GB",
      details: "Flex pricing or commitment tiers; includes retention"
    },
    targetMarket: ["Mid-market", "Enterprise", "DevSecOps teams"],
    keyFeatures: [
      "Continuous Intelligence Platform",
      "Cloud SIEM with entity behavior analytics",
      "Real-time alerting + dashboards",
      "Deep AWS, GCP, Azure integrations",
      "Log analytics + security analytics unified",
      "Threat Intelligence from CrowdStrike, Proofpoint"
    ],
    strengths: [
      "Extremely strong DevOps + security unification",
      "Scalable cloud-native architecture",
      "Good out-of-box AWS coverage",
      "Flexible pricing tiers"
    ],
    weaknesses: [
      "Credits model can be confusing to budget",
      "SOAR/response automation less mature",
      "Not ideal for non-cloud heavy shops",
      "Support tiers vary in quality"
    ],
    integrations: 600,
    deployment: "SaaS (multi-cloud)",
    aiCapabilities: true,
    url: "https://www.sumologic.com"
  },
  {
    name: "Exabeam Fusion SIEM",
    category: "Cloud SIEM/SOAR",
    tagline: "Behavior analytics-powered SIEM — detect advanced threats, not just rule matches",
    pricing: {
      model: "Subscription",
      starting: "Contact sales",
      details: "Per-user or per-asset; UEBA included"
    },
    targetMarket: ["Enterprise", "Financial services", "Healthcare"],
    keyFeatures: [
      "Advanced UEBA (User & Entity Behavior Analytics)",
      "Timeline-based investigations",
      "Smart Timelines auto-build attack story",
      "SOAR automation built-in",
      "Threat Intelligence integration",
      "Compliance reporting out-of-box"
    ],
    strengths: [
      "Best UEBA in the market",
      "Dramatically reduces investigation time",
      "Strong compliance coverage (PCI, HIPAA, SOX)",
      "Low false positive rates through behavioral baselines"
    ],
    weaknesses: [
      "Pricing premium for UEBA capabilities",
      "Complex initial deployment",
      "Data onboarding requires planning",
      "Smaller ecosystem vs Splunk/Sentinel"
    ],
    integrations: 500,
    deployment: "SaaS / Cloud",
    aiCapabilities: true,
    url: "https://www.exabeam.com"
  },
  {
    name: "Rapid7 InsightIDR",
    category: "Cloud SIEM/SOAR",
    tagline: "Cloud SIEM + SOAR + UEBA in one — attacker behavior detection made practical",
    pricing: {
      model: "Per-asset subscription",
      starting: "$~15–25/asset/month",
      details: "Includes SOAR, UEBA, log retention"
    },
    targetMarket: ["Mid-market", "Enterprise"],
    keyFeatures: [
      "Attacker Behavior Analytics (ABA)",
      "Built-in SOAR (InsightConnect)",
      "Deception technology (honeypots)",
      "Endpoint agent included",
      "Cloud + SaaS log coverage",
      "Managed Detection & Response (MDR) add-on"
    ],
    strengths: [
      "All-in-one pricing (SIEM + SOAR + UEBA)",
      "Fast time-to-value",
      "Strong SMB and mid-market fit",
      "MDR upgrade path without vendor change"
    ],
    weaknesses: [
      "Less customizable than Splunk",
      "Ingestion limits on lower tiers",
      "Large enterprise may outgrow it",
      "SOAR less powerful than Splunk SOAR"
    ],
    integrations: 350,
    deployment: "SaaS",
    aiCapabilities: true,
    url: "https://www.rapid7.com/products/insightidr"
  },
  {
    name: "SentinelOne Singularity XDR",
    category: "AI-First SOC Analyst",
    tagline: "AI-powered XDR — autonomous threat detection, investigation, and response at machine speed",
    pricing: {
      model: "Per-endpoint subscription",
      starting: "$~8–15/endpoint/month",
      details: "Tiers: Core, Control, Complete; SIEM add-on available"
    },
    targetMarket: ["Mid-market", "Enterprise", "MSSPs"],
    keyFeatures: [
      "Autonomous AI detection + response (no human required)",
      "Purple AI copilot for investigation",
      "Storyline™ automated attack visualization",
      "XDR data lake (Singularity DataLake)",
      "1-click remediation and rollback",
      "MITRE ATT&CK mapping built-in"
    ],
    strengths: [
      "Fastest detection-to-response in the market",
      "Purple AI makes analysts more effective",
      "Rollback to pre-attack state (endpoint)",
      "Strong MSSP and channel ecosystem"
    ],
    weaknesses: [
      "SIEM capabilities require add-on",
      "Best value with SentinelOne-first stack",
      "Log ingestion pricing can add up",
      "Less enterprise SOAR workflow depth"
    ],
    integrations: 300,
    deployment: "SaaS / Cloud",
    aiCapabilities: true,
    url: "https://www.sentinelone.com/platform"
  },
  {
    name: "Palo Alto Cortex XSIAM",
    category: "Enterprise SOAR",
    tagline: "The AI SOC platform — replaces legacy SIEM, SOAR, and UEBA with one unified system",
    pricing: {
      model: "Platform subscription",
      starting: "Contact sales ($200K+ typical enterprise)",
      details: "Replaces multiple point products; ROI story is consolidation"
    },
    targetMarket: ["Enterprise", "Large Enterprise", "Government"],
    keyFeatures: [
      "AI-driven detection across endpoint, cloud, network, identity",
      "Automated playbooks (XSOAR-based)",
      "UEBA + threat intelligence built-in",
      "Out-of-box data normalization (1,000+ parsers)",
      "ML-based alert clustering (cuts alert volume 98%)",
      "Integrated threat hunting with XQL"
    ],
    strengths: [
      "True SOC platform consolidation",
      "98% alert reduction through AI correlation",
      "Deep Palo Alto ecosystem integration",
      "Fast SOC analyst workflows"
    ],
    weaknesses: [
      "Very expensive — enterprise-only price point",
      "Best value inside Palo Alto stack",
      "Large implementation projects required",
      "Overkill for teams under 500 endpoints"
    ],
    integrations: 1000,
    deployment: "SaaS (Palo Alto Cloud)",
    aiCapabilities: true,
    url: "https://www.paloaltonetworks.com/cortex/cortex-xsiam"
  },
  {
    name: "Huntress",
    category: "AI-First SOC Analyst",
    tagline: "Managed EDR + SOC for SMBs — persistent foothold detection, human-backed",
    pricing: {
      model: "Per-endpoint/month",
      starting: "$~3.30/endpoint/month (MSP pricing)",
      details: "Includes 24/7 SOC analysts; low minimum"
    },
    targetMarket: ["SMB", "MSPs / MSSPs"],
    keyFeatures: [
      "Persistent foothold detection (attackers hiding in plain sight)",
      "24/7 human SOC operations included",
      "Managed antivirus (Defender optimization)",
      "Ransomware canaries",
      "Identity protection (M365 / Azure AD)",
      "ThreatOps — expert remediation guidance"
    ],
    strengths: [
      "Lowest entry point with human SOC included",
      "Purpose-built for MSPs and SMBs",
      "No alert fatigue — humans triage before you see it",
      "Fast deployment (minutes per endpoint)"
    ],
    weaknesses: [
      "Not designed for large enterprise",
      "Limited SIEM/log management",
      "Network coverage limited vs enterprise XDR",
      "Scales with endpoints, not log volume"
    ],
    integrations: 50,
    deployment: "SaaS (cloud)",
    aiCapabilities: true,
    url: "https://www.huntress.com"
  },
  {
    name: "Devo SIEM",
    category: "Cloud SIEM/SOAR",
    tagline: "High-speed cloud SIEM — ingest everything, query in seconds at any scale",
    pricing: {
      model: "Per GB ingested",
      starting: "Contact sales",
      details: "Retention included; no separate storage charges"
    },
    targetMarket: ["Enterprise", "Large Enterprise", "MSSPs"],
    keyFeatures: [
      "Sub-second query performance at petabyte scale",
      "Hot retention up to 400 days included",
      "MITRE ATT&CK aligned detection library",
      "Multitenancy for MSSPs",
      "Activeboards (real-time dashboards)",
      "SOAR integration via Devo SOAR"
    ],
    strengths: [
      "Fastest query speed in the market",
      "No data tiering — everything stays hot",
      "MSSP multitenancy purpose-built",
      "Predictable retention pricing"
    ],
    weaknesses: [
      "Less known outside large enterprise",
      "Smaller ecosystem than Splunk or Sentinel",
      "UEBA and AI features still maturing",
      "Professional services needed for large deployments"
    ],
    integrations: 400,
    deployment: "SaaS",
    aiCapabilities: true,
    url: "https://www.devo.com"
  },
];

export const categories = [
  { id: "ai-first",       name: "AI-First SOC Analyst",   description: "Agentic AI platforms"            },
  { id: "low-code-soar",  name: "Low-Code SOAR",           description: "No-code workflow automation"     },
  { id: "enterprise-soar",name: "Enterprise SOAR",         description: "Comprehensive orchestration"     },
  { id: "open-source",    name: "Open-Source SIEM",        description: "Free, community-driven"          },
  { id: "cloud-siem",     name: "Cloud SIEM/SOAR",         description: "Cloud-native security operations"},
];
