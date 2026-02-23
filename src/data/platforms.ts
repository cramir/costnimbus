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
  }
];

export const categories = [
  { id: "ai-first", name: "AI-First SOC Analyst", description: "Agentic AI platforms" },
  { id: "low-code-soar", name: "Low-Code SOAR", description: "No-code workflow automation" },
  { id: "enterprise-soar", name: "Enterprise SOAR", description: "Comprehensive orchestration" },
  { id: "open-source", name: "Open-Source SIEM", description: "Free, community-driven" },
  { id: "cloud-siem", name: "Cloud SIEM/SOAR", description: "Cloud-native security operations" }
];
