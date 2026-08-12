import { mkdir, rm, copyFile, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const files = [
  'index.html',
  'military-value.html',
  'schools.html',
  'bases.html',
  'sitemap.xml',
  'robots.txt',
  'feedback.js'
];

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

for (const file of files) {
  if (!existsSync(file)) throw new Error(`Missing release file: ${file}`);
  await copyFile(file, `dist/${file}`);
}

const indexPath = 'dist/index.html';
let index = await readFile(indexPath, 'utf8');
if (!index.includes('feedback.js')) {
  index = index.replace('</body>', '<script src="/feedback.js" defer></script>\n</body>');
  await writeFile(indexPath, index);
}

const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local';
const release = {
  app: 'mission-rated',
  git_sha: sha,
  generated_at: new Date().toISOString(),
  source: process.env.VERCEL_GIT_COMMIT_SHA ? 'vercel-git' : process.env.GITHUB_SHA ? 'github-actions' : 'local'
};

await writeFile('dist/release.json', `${JSON.stringify(release, null, 2)}\n`);
console.log(`Mission Rated release built for ${sha}`);
