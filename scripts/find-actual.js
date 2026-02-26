import fs from 'fs';
import { execSync } from 'child_process';

// Use find command to locate package.json files
try {
  const result = execSync('find / -name "package.json" -not -path "*/node_modules/*" -not -path "*/proc/*" 2>/dev/null | head -30', { encoding: 'utf8' });
  console.log('package.json locations:\n', result);
} catch (e) {
  console.log('find error:', e.message);
}

// Also check cwd
try {
  const result = execSync('pwd', { encoding: 'utf8' });
  console.log('CWD:', result);
} catch (e) {}

try {
  const result = execSync('ls -la /vercel/', { encoding: 'utf8' });
  console.log('/vercel/:', result);
} catch (e) {
  console.log('/vercel/ error:', e.message);
}
