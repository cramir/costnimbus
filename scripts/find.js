import { execSync } from 'child_process';

// Find next.config files anywhere
try {
  const r1 = execSync('find / -name "next.config*" -not -path "*/node_modules/*" 2>/dev/null', { timeout: 10000 }).toString();
  console.log('next.config files:\n', r1);
} catch(e) { console.log('find error:', e.message); }

// Find package.json files with "next" in them
try {
  const r2 = execSync('find / -maxdepth 6 -name "package.json" -not -path "*/node_modules/*" 2>/dev/null', { timeout: 10000 }).toString();
  console.log('package.json files:\n', r2);
} catch(e) { console.log('find error:', e.message); }
