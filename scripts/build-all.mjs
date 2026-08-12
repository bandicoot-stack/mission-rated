import './build.mjs';
import { copyFile, readFile, writeFile } from 'node:fs/promises';

for (const file of ['school.html','installation.html','detail-links.js']) await copyFile(file, `dist/${file}`);
for (const file of ['schools.html','bases.html']) {
  const path = `dist/${file}`;
  let html = await readFile(path, 'utf8');
  if (!html.includes('detail-links.js')) html = html.replace('</body>', '<script src="/detail-links.js" defer></script>\n</body>');
  await writeFile(path, html);
}
console.log('Mission Rated detail pages added to release');
