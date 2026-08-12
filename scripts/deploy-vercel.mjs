import { readFile } from 'node:fs/promises';

const token = process.env.VERCEL_TOKEN;
if (!token) throw new Error('VERCEL_TOKEN is required');

const teamId = process.env.VERCEL_TEAM_ID || 'team_keaLn1aS3rp2RW0ewC2SwKJV';
const projectName = process.env.VERCEL_PROJECT_NAME || 'mission-rated-beta';
const target = process.env.VERCEL_TARGET || 'production';
const sha = process.env.GITHUB_SHA || 'unknown';
const ref = process.env.GITHUB_REF_NAME || 'main';

const releaseFiles = [
  'index.html',
  'military-value.html',
  'schools.html',
  'bases.html',
  'sitemap.xml',
  'robots.txt',
  'feedback.js',
  'rankings.js',
  'package.json',
  'vercel.json',
  'scripts/build.mjs'
];

const files = await Promise.all(releaseFiles.map(async file => ({
  file,
  data: await readFile(file, 'utf8'),
  encoding: 'utf-8'
})));

const body = {
  name: projectName,
  project: projectName,
  target,
  files,
  projectSettings: {
    framework: null,
    buildCommand: 'npm run build',
    outputDirectory: 'dist'
  },
  gitMetadata: {
    remoteUrl: 'https://github.com/bandicoot-stack/mission-rated.git',
    commitSha: sha,
    commitRef: ref,
    commitMessage: process.env.GITHUB_COMMIT_MESSAGE || `Mission Rated ${sha.slice(0, 7)}`
  },
  meta: {
    githubCommitSha: sha,
    githubCommitRef: ref,
    releasePipeline: 'github-actions-explicit-payload'
  }
};

console.log(`Deploying ${files.length} files to ${projectName} (${target}) for ${sha}`);

const response = await fetch(`https://api.vercel.com/v13/deployments?teamId=${encodeURIComponent(teamId)}`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

const text = await response.text();
let result;
try { result = JSON.parse(text); } catch { result = { raw: text }; }

if (!response.ok) {
  console.error(JSON.stringify({ status: response.status, result }, null, 2));
  throw new Error(`Vercel deployment failed with HTTP ${response.status}`);
}

const deploymentUrl = result.url ? `https://${result.url}` : null;
console.log(JSON.stringify({ id: result.id, url: deploymentUrl, readyState: result.readyState, target }, null, 2));

if (!deploymentUrl) throw new Error('Vercel response did not include a deployment URL');

const deadline = Date.now() + 180_000;
let lastStatus = 'unknown';
while (Date.now() < deadline) {
  await new Promise(r => setTimeout(r, 5000));
  const statusRes = await fetch(`https://api.vercel.com/v13/deployments/${encodeURIComponent(result.id)}?teamId=${encodeURIComponent(teamId)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const status = await statusRes.json();
  lastStatus = status.readyState || status.state || 'unknown';
  console.log(`Vercel deployment state: ${lastStatus}`);
  if (lastStatus === 'READY') break;
  if (['ERROR', 'CANCELED'].includes(lastStatus)) throw new Error(`Vercel deployment ended in ${lastStatus}`);
}
if (lastStatus !== 'READY') throw new Error(`Timed out waiting for Vercel deployment; last state ${lastStatus}`);

const canonical = 'https://mission-rated-beta.vercel.app';
const releaseRes = await fetch(`${canonical}/release.json?sha=${encodeURIComponent(sha)}`, { cache: 'no-store' });
if (!releaseRes.ok) throw new Error(`Production release.json returned HTTP ${releaseRes.status}`);
const release = await releaseRes.json();
if (release.git_sha !== sha) throw new Error(`Production SHA mismatch: expected ${sha}, got ${release.git_sha}`);

for (const path of ['/', '/military-value', '/schools', '/bases']) {
  const r = await fetch(`${canonical}${path}`, { redirect: 'follow', cache: 'no-store' });
  if (!r.ok) throw new Error(`Production smoke test failed: ${path} -> HTTP ${r.status}`);
  console.log(`Verified ${path} -> ${r.status}`);
}

console.log(`Production verified at ${sha}`);
