import './build.mjs';
import { copyFile, cp, readFile, writeFile, mkdir, readdir } from 'node:fs/promises';

await mkdir('dist/assets',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
await mkdir('dist/partners',{recursive:true});
await cp('partners','dist/partners',{recursive:true});
await mkdir('dist/agent-system',{recursive:true});
for (const file of ['registry.json','state.json','work-queue.json']) await copyFile(`agent-system/${file}`, `dist/agent-system/${file}`);
await copyFile('brand.js','dist/brand.js');
for (const file of ['school.html','installation.html','detail-links.js','deal-expiry.js','weekly.js','home-priority.js','featured-partners.js','partner-logo.js','featured-home.js','gui-cleanup.js','featured-landing-fix.js','labor-day.html','fall.html','fall-mission-rated.js','local-intel.html','local-intel-embeds.js','instagram-connect.js','instagram-connect.html','instagram-connect-tool.js','deal-share.js','featured.html','family-pass.html','growth-loop.js','pcs-hampton-roads.html','business-share-kit.html','creator-guides.html','partner-pipeline.html','mission-control.html','mission-control.js','mission-control-metrics.json','99012cfad8c2e9d0d3cc9683bb7afaba.txt']) await copyFile(file, `dist/${file}`);
for (const file of ['schools.html','bases.html']) {
  const path = `dist/${file}`;
  let html = await readFile(path, 'utf8');
  if (!html.includes('detail-links.js')) html = html.replace('</body>', '<script src="/detail-links.js" defer></script>\n</body>');
  await writeFile(path,html);
}
for (const file of ['index.html','military-value.html']) {
  const path = `dist/${file}`;
  let html = await readFile(path,'utf8');
  if (!html.includes('deal-expiry.js')) html = html.replace('</body>','<script src="/deal-expiry.js" defer></script>\n</body>');
  if (file === 'index.html' && !html.includes('weekly.js')) html=html.replace('</body>','<script src="/weekly.js" defer></script>\n</body>');
  for (const asset of file==='index.html'?['featured-partners.js','partner-logo.js','home-priority.js','featured-home.js','gui-cleanup.js','featured-landing-fix.js']:[]) if(!html.includes(asset)) html=html.replace('</body>',`<script src="/${asset}" defer></script>\n</body>`);
  await writeFile(path,html);
}
for (const file of ['business.html','school.html','installation.html']) {
  const path=`dist/${file}`;let html=await readFile(path,'utf8');
  for(const asset of ['quick-vote.js','lifestyle-nav.js','mobile-browse.js','browse-state.js']) if(!html.includes(asset)) html=html.replace('</body>',`<script src="/${asset}" defer></script>\n</body>`);
  await writeFile(path,html);
}
{
  const path='dist/fall.html';let html=await readFile(path,'utf8');if(!html.includes('fall-mission-rated.js'))html=html.replace('</body>','<script src="/fall-mission-rated.js" defer></script>\n</body>');await writeFile(path,html);
}
{
  const path='dist/local-intel.html';let html=await readFile(path,'utf8');for(const asset of ['local-intel-embeds.js','instagram-connect.js'])if(!html.includes(asset))html=html.replace('</body>',`<script src="/${asset}" defer></script>\n</body>`);await writeFile(path,html);
}
for (const file of (await readdir('dist')).filter(file=>file.endsWith('.html'))) {
  if (file === 'mission-control.html') continue;
  const path=`dist/${file}`;let html=await readFile(path,'utf8');
  if(!html.includes('/brand.js'))html=html.replace('</body>','<script src="/brand.js" defer></script>\n</body>');
  if(!html.includes('/growth-loop.js'))html=html.replace('</body>','<script src="/growth-loop.js" defer></script>\n</body>');
  await writeFile(path,html);
}
await import('./ai-discovery.mjs');
console.log('Mission Rated release includes Family Pass, referral loop, PCS acquisition, business distribution kit, creator distribution, partner pipeline, founder command center, growth QA, and AI discovery metadata');
