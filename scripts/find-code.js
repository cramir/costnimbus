import fs from 'fs';

// Check /code which appeared in root listing
function listDir(dir) {
  try {
    const entries = fs.readdirSync(dir);
    console.log(`${dir}: ${entries.join(', ')}`);
    return entries;
  } catch (e) {
    console.log(`Cannot read ${dir}: ${e.message}`);
    return [];
  }
}

listDir('/code');
const entries = listDir('/code');
for (const e of entries) {
  listDir(`/code/${e}`);
}
