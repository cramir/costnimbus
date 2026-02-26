import { readFileSync, existsSync, readdirSync } from 'fs';

const base = '/home/user';

console.log('=== ROOT ===');
console.log(readdirSync(base).join('\n'));

const files = [
  'next.config.ts',
  'next.config.js', 
  'next.config.mjs',
  'package.json',
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/lib/articles.ts',
  'src/app/globals.css',
  'postcss.config.mjs',
  'postcss.config.js',
  'public/index.html',
];

for (const f of files) {
  const p = `${base}/${f}`;
  if (existsSync(p)) {
    console.log(`\n====== ${f} ======`);
    console.log(readFileSync(p, 'utf8'));
  } else {
    console.log(`\n====== ${f} -- MISSING ======`);
  }
}
