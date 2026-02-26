import fs from 'fs';
import path from 'path';

const root = '/vercel/share/v0-project';

const files = [
  'next.config.ts',
  'package.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/lib/articles.ts',
  'src/components/home-content.tsx',
];

for (const f of files) {
  const full = path.join(root, f);
  console.log('\n========== ' + f + ' ==========');
  try {
    console.log(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    console.log('ERROR reading: ' + e.message);
  }
}

// Also list src/content
const contentDir = path.join(root, 'src/content');
console.log('\n========== src/content files ==========');
try {
  console.log(fs.readdirSync(contentDir).join('\n'));
} catch (e) {
  console.log('ERROR: ' + e.message);
}
