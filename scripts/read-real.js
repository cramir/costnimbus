import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = '/home/user';

// List top level
console.log('=== /home/user ===');
console.log(fs.readdirSync(root).join('\n'));

// List src/app
console.log('\n=== /home/user/src/app ===');
try { console.log(execSync('find /home/user/src/app -type f', { encoding: 'utf8' })); } catch(e) { console.log(e.message); }

// Read key files
const files = [
  'next.config.ts',
  'package.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/lib/articles.ts',
];

for (const f of files) {
  const full = path.join(root, f);
  console.log(`\n========== ${f} ==========`);
  try { console.log(fs.readFileSync(full, 'utf8')); }
  catch (e) { console.log('ERROR: ' + e.message); }
}

// List src/content
console.log('\n=== src/content ===');
try { console.log(fs.readdirSync('/home/user/src/content').join('\n')); }
catch (e) { console.log('ERROR: ' + e.message); }
