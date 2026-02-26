import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const base = '/vercel/share/v0-project';

// Check if base exists
console.log('base exists:', existsSync(base));

// List root
if (existsSync(base)) {
  console.log('\n--- ROOT FILES ---');
  readdirSync(base).forEach(f => console.log(f));
}

// Read key files
const files = [
  'next.config.ts',
  'next.config.js',
  'next.config.mjs',
  'package.json',
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/lib/articles.ts',
  'public/index.html',
];

for (const f of files) {
  const p = join(base, f);
  console.log(`\n=== ${f} (exists: ${existsSync(p)}) ===`);
  if (existsSync(p)) {
    console.log(readFileSync(p, 'utf8'));
  }
}
