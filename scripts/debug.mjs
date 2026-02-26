import fs from 'fs';
import path from 'path';

const files = [
  'next.config.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/lib/articles.ts',
  'package.json',
];

for (const f of files) {
  const full = path.join('/vercel/share/v0-project', f);
  console.log(`\n${'='.repeat(60)}\n FILE: ${f}\n${'='.repeat(60)}`);
  try {
    console.log(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    console.log('ERROR reading:', e.message);
  }
}

// Also list src/content
const contentDir = '/vercel/share/v0-project/src/content';
console.log(`\n${'='.repeat(60)}\n DIR: src/content\n${'='.repeat(60)}`);
try {
  console.log(fs.readdirSync(contentDir).join('\n'));
} catch (e) {
  console.log('ERROR:', e.message);
}
