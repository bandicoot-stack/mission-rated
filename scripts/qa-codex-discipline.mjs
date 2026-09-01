import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function requireText(rel, needle, why) {
  const source = read(rel);
  if (!source.includes(needle)) failures.push(`${rel}: ${why}`);
}

function scanForDirectOidcEnv(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForDirectOidcEnv(full);
      continue;
    }
    if (!/\.(?:js|mjs|cjs|ts|tsx)$/.test(entry.name)) continue;
    const source = fs.readFileSync(full, 'utf8');
    if (/process\.env\.VERCEL_OIDC_TOKEN\b/.test(source)) {
      failures.push(`${path.relative(root, full)}: direct VERCEL_OIDC_TOKEN access is forbidden; acquire Vercel identity with getVercelOidcToken() at request time`);
    }
  }
}

scanForDirectOidcEnv(root);

const eventSource = read('api/event.js');
if (!/import\s*\{\s*getVercelOidcToken\s*\}\s*from\s*['"]@vercel\/oidc['"]/.test(eventSource)) {
  failures.push('api/event.js: must import getVercelOidcToken from @vercel/oidc');
}
if (!/export\s+default\s+async\s+function\s+handler[\s\S]*await\s+getVercelOidcToken\s*\(/.test(eventSource)) {
  failures.push('api/event.js: OIDC token must be acquired inside the async request handler so each persistence attempt gets fresh runtime identity');
}
if (!/authorization:\s*`Bearer \$\{oidcToken\}`/.test(eventSource)) {
  failures.push('api/event.js: growth ingest request must use the request-scoped OIDC token as Bearer authorization');
}

requireText('AGENTS.md', 'Equivalent-work preflight', 'must require an equivalent-work preflight before material branches or replacement PRs');
requireText('AGENTS.md', 'One intent, one active branch', 'must enforce one active branch/PR per intent');
requireText('.github/PULL_REQUEST_TEMPLATE.md', 'Equivalent-work preflight', 'PRs must record duplicate-work preflight evidence');
requireText('.github/PULL_REQUEST_TEMPLATE.md', 'Durable state / queue updated', 'PRs must explicitly reconcile durable state when reality changed');

if (failures.length) {
  console.error('Codex discipline QA failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('Codex discipline QA passed.');
