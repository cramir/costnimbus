import fs from 'fs';
import path from 'path';

function findPackageJson(dir, depth = 0) {
  if (depth > 5) return;
  try {
    const entries = fs.readdirSync(dir);
    console.log(`[${depth}] ${dir}: ${entries.join(', ')}`);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git') continue;
      const full = path.join(dir, entry);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          findPackageJson(full, depth + 1);
        }
      } catch {}
    }
  } catch (e) {
    console.log(`Cannot read ${dir}: ${e.message}`);
  }
}

findPackageJson('/');
