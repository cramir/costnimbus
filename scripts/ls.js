import { readdirSync, existsSync } from 'fs';

const dirs = ['/', '/home', '/home/user', '/app', '/workspace', '/project', '/code', '/usr/src', '/srv', '/opt'];
for (const d of dirs) {
  try {
    const files = readdirSync(d);
    console.log(`${d}:`, files.join(', '));
  } catch(e) {
    console.log(`${d}: ENOENT`);
  }
}
