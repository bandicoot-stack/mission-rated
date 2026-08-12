import { mkdir, rm, copyFile, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const htmlFiles = ['index.html', 'military-value.html', 'schools.html', 'bases.html', 'neighborhoods.html', 'community.html', 'buy-a-car.html'];
const files = [...htmlFiles, 'sitemap.xml', 'robots.txt', 'feedback.js', 'rankings.js', 'quick-vote.js', 'reviews.js', 'community.js'];

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of files) { if (!existsSync(file)) throw new Error(`Missing release file: ${file}`); await copyFile(file, `dist/${file}`); }
for (const file of htmlFiles) {
 const path=`dist/${file}`; let html=await readFile(path,'utf8');
 if(!html.includes('feedback.js')) html=html.replace('</body>','<script src="/feedback.js" defer></script>\n</body>');
 if(!html.includes('rankings.js')&&!['neighborhoods.html','community.html','buy-a-car.html'].includes(file)) html=html.replace('</body>','<script src="/rankings.js" defer></script>\n</body>');
 if(!html.includes('quick-vote.js')&&!['neighborhoods.html','community.html','buy-a-car.html'].includes(file)) html=html.replace('</body>','<script src="/quick-vote.js" defer></script>\n</body>');
 if(!html.includes('reviews.js')&&!['community.html','buy-a-car.html'].includes(file)) html=html.replace('</body>','<script src="/reviews.js" defer></script>\n</body>');
 await writeFile(path,html);
}
const sha=process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA||'local';
const release={app:'mission-rated',git_sha:sha,generated_at:new Date().toISOString(),source:process.env.VERCEL_GIT_COMMIT_SHA?'vercel-git':process.env.GITHUB_SHA?'github-actions':'local'};
await writeFile('dist/release.json',`${JSON.stringify(release,null,2)}\n`);
console.log(`Mission Rated release built for ${sha}`);
