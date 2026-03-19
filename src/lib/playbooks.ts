import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface PlaybookStep {
  id: string;
  name: string;
  type: string;
  tool?: string;
  description: string;
  automation_hint?: string;
  outputs?: string[];
}

export interface PlaybookIntegration {
  platform: string;
  optional: boolean;
  notes: string;
}

export interface Playbook {
  id: string;
  name: string;
  version: string;
  author: string;
  category: string;
  severity: string[];
  mitre_attack: string[];
  trigger: string[];
  tags: string[];
  tools_required: string[];
  estimated_time: string;
  integrations: PlaybookIntegration[];
  steps: PlaybookStep[];
  post_incident: string[];
  metrics: {
    avg_resolution_time: string;
    false_positive_rate: string;
    escalation_rate: string;
  };
  // derived
  filename: string;
  githubUrl: string;
}

const PLAYBOOKS_DIR = path.join(process.cwd(), 'src/data/playbooks');
const GITHUB_BASE = 'https://github.com/costnimbus/soc-playbooks/blob/main/playbooks';

export function getAllPlaybooks(): Playbook[] {
  const playbooks: Playbook[] = [];

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
        try {
          const raw = fs.readFileSync(fullPath, 'utf8');
          const data = yaml.load(raw) as Record<string, unknown>;
          const category = path.basename(path.dirname(fullPath));
          const filename = entry.name;
          const playbook: Playbook = {
            id: (data.id as string) || filename.replace('.yaml', ''),
            name: (data.name as string) || '',
            version: (data.version as string) || '1.0.0',
            author: (data.author as string) || 'CostNimbus',
            category: (data.category as string) || category,
            severity: (data.severity as string[]) || [],
            mitre_attack: ((data.mitre_attack as string[]) || []).map(s => s.split(/\s+#/)[0].trim()),
            trigger: (data.trigger as string[]) || [],
            tags: (data.tags as string[]) || [],
            tools_required: (data.tools_required as string[]) || [],
            estimated_time: (data.estimated_time as string) || '',
            integrations: (data.integrations as PlaybookIntegration[]) || [],
            steps: (data.steps as PlaybookStep[]) || [],
            post_incident: (data.post_incident as string[]) || [],
            metrics: (data.metrics as Playbook['metrics']) || {
              avg_resolution_time: '',
              false_positive_rate: '',
              escalation_rate: '',
            },
            filename,
            githubUrl: `${GITHUB_BASE}/${category}/${filename}`,
          };
          playbooks.push(playbook);
        } catch (err) {
          console.error(`Failed to parse ${fullPath}:`, err);
        }
      }
    }
  }

  walkDir(PLAYBOOKS_DIR);
  return playbooks.sort((a, b) => a.id.localeCompare(b.id));
}

export function getPlaybookById(id: string): Playbook | undefined {
  return getAllPlaybooks().find(p => p.id === id);
}

export function getAllCategories(): string[] {
  const cats = new Set(getAllPlaybooks().map(p => p.category));
  return Array.from(cats).sort();
}

export function getAllMitreIds(): string[] {
  const ids = new Set(getAllPlaybooks().flatMap(p => p.mitre_attack));
  return Array.from(ids).sort();
}

export function getAllSeverities(): string[] {
  const sevs = new Set(getAllPlaybooks().flatMap(p => p.severity));
  return Array.from(sevs).sort();
}

export function generateMermaidFlowchart(playbook: Playbook): string {
  const lines: string[] = ['flowchart TD'];

  const stepTypeStyle: Record<string, string> = {
    investigation: 'style %id% fill:#1c2128,stroke:#00d4ff,color:#f0f6fc',
    action: 'style %id% fill:#1c2128,stroke:#a855f7,color:#f0f6fc',
    notification: 'style %id% fill:#1c2128,stroke:#f59e0b,color:#f0f6fc',
    containment: 'style %id% fill:#1c2128,stroke:#ef4444,color:#f0f6fc',
    remediation: 'style %id% fill:#1c2128,stroke:#22c55e,color:#f0f6fc',
  };

  // Add nodes
  for (const step of playbook.steps) {
    const safeId = step.id.replace(/-/g, '_');
    const label = step.name.replace(/"/g, "'").substring(0, 40);
    const typeIcon: Record<string, string> = {
      investigation: '🔍',
      action: '⚡',
      notification: '📣',
      containment: '🛑',
      remediation: '🔧',
    };
    const icon = typeIcon[step.type] || '▶';
    lines.push(`    ${safeId}["${icon} ${label}"]`);
  }

  // Add edges
  for (let i = 0; i < playbook.steps.length - 1; i++) {
    const from = playbook.steps[i].id.replace(/-/g, '_');
    const to = playbook.steps[i + 1].id.replace(/-/g, '_');
    lines.push(`    ${from} --> ${to}`);
  }

  // Add styles
  for (const step of playbook.steps) {
    const safeId = step.id.replace(/-/g, '_');
    const styleTemplate = stepTypeStyle[step.type];
    if (styleTemplate) {
      lines.push(`    ${styleTemplate.replace('%id%', safeId)}`);
    }
  }

  return lines.join('\n');
}
