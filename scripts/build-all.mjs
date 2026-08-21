import './build.mjs';
import { copyFile, readFile, writeFile } from 'node:fs/promises';

for (const file of ['school.html','installation.html','detail-links.js','deal-expiry.js','weekly.js','local-intel.html','local-intel-embeds.js','instagram-connect.js']) await copyFile(file, `dist/${file}`);
for (const file of ['schools.html','bases.html']) {
  const path = `dist/${file}`;
  let html = await readFile(path, 'utf8');
  if (!html.includes('detail-links.js')) html = html.replace('</body>', '<script src="/detail-links.js" defer></script>\n</body>');
  await writeFile(path, html);
}
for (const file of ['index.html','military-value.html']) {
  const path = `dist/${file}`;
  let html = await readFile(path, 'utf8');
  if (!html.includes('deal-expiry.js')) html = html.replace('</body>', '<script src="/deal-expiry.js" defer></script>\n</body>');
  if (file === 'index.html' && !html.includes('weekly.js')) html = html.replace('</body>', '<script src="/weekly.js" defer></script>\n</body>');
  await writeFile(path, html);
}
for (const file of ['business.html','school.html','installation.html']) {
  const path = `dist/${file}`;
  let html = await readFile(path, 'utf8');
  for (const asset of ['quick-vote.js','lifestyle-nav.js','mobile-browse.js','browse-state.js']) {
    if (!html.includes(asset)) html = html.replace('</body>', `<script src="/${asset}" defer></script>\n</body>`);
  }
  await writeFile(path, html);
}
{
  const path='dist/local-intel.html';
  let html=await readFile(path,'utf8');
  for(const asset of ['local-intel-embeds.js','instagram-connect.js']) if(!html.includes(asset)) html=html.replace('</body>',`<script src="/${asset}" defer></script>\n</body>`);
  await writeFile(path,html);
}
console.log('Mission Rated Local Intel embeds and Instagram creator connection added to release');
