import './build.mjs';
import { copyFile, readFile, writeFile, mkdir } from 'node:fs/promises';

await mkdir('dist/assets',{recursive:true});
for (const file of ['school.html','installation.html','detail-links.js','deal-expiry.js','weekly.js','home-priority.js','featured-home.js','gui-cleanup.js','featured-landing-fix.js','labor-day.html','fall.html','fall-mission-rated.js','local-intel.html','local-intel-embeds.js','instagram-connect.js','deal-share.js','featured.html','99012cfad8c2e9d0d3cc9683bb7afaba.txt']) await copyFile(file, `dist/${file}`);
for (const file of ['yorktown-primary.webp','yorktown-secondary.webp']) await copyFile(`assets/${file}`, `dist/assets/${file}`);
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
  if (file === 'index.html' && !html.includes('home-priority.js')) html = html.replace('</body>', '<script src="/home-priority.js" defer></script>\n</body>');
  if (file === 'index.html' && !html.includes('featured-home.js')) html = html.replace('</body>', '<script src="/featured-home.js" defer></script>\n</body>');
  if (file === 'index.html' && !html.includes('gui-cleanup.js')) html = html.replace('</body>', '<script src="/gui-cleanup.js" defer></script>\n</body>');
  if (file === 'index.html' && !html.includes('featured-landing-fix.js')) html = html.replace('</body>', '<script src="/featured-landing-fix.js" defer></script>\n</body>');
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
  const path='dist/fall.html';
  let html=await readFile(path,'utf8');
  if(!html.includes('fall-mission-rated.js')) html=html.replace('</body>','<script src="/fall-mission-rated.js" defer></script>\n</body>');
  await writeFile(path,html);
}
{
  const path='dist/local-intel.html';
  let html=await readFile(path,'utf8');
  for(const asset of ['local-intel-embeds.js','instagram-connect.js']) if(!html.includes(asset)) html=html.replace('</body>',`<script src="/${asset}" defer></script>\n</body>`);
  await writeFile(path,html);
}
await import('./ai-discovery.mjs');
console.log('Mission Rated homepage priorities, prominent Featured Partners, cleaned GUI, deterministic Featured landing, Yorktown partner assets, Fall Deals & Finds with MR attributes, Labor Day archive, Local Intel, Instagram connection, deal sharing, IndexNow key and AI discovery metadata added to release');
