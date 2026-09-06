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

const eventSource = read('api/event.js');

if (eventSource.includes('process.env.VERCEL_OIDC_TOKEN')) {
  failures.push('api/event.js: direct VERCEL_OIDC_TOKEN access is forbidden; acquire Vercel identity with getVercelOidcToken() at request time');
}
if (!eventSource.includes("import { getVercelOidcToken } from '@vercel/oidc';")) {
  failures.push('api/event.js: must import getVercelOidcToken from @vercel/oidc');
}
const handlerIndex = eventSource.indexOf('export default async function handler');
const oidcIndex = eventSource.indexOf('await getVercelOidcToken(', handlerIndex);
if (handlerIndex < 0 || oidcIndex < handlerIndex) {
  failures.push('api/event.js: OIDC token must be acquired inside the async request handler so each persistence attempt gets fresh runtime identity');
}
if (!eventSource.includes('authorization: `Bearer ${oidcToken}`')) {
  failures.push('api/event.js: growth ingest request must use the request-scoped OIDC token as Bearer authorization');
}

requireText('AGENTS.md', 'Equivalent-work preflight', 'must require an equivalent-work preflight before material branches or replacement PRs');
requireText('AGENTS.md', 'One intent, one active branch', 'must enforce one active branch/PR per intent');
requireText('AGENTS.md', 'Read before write', 'must require agents to inspect existing code and patterns before editing');
requireText('AGENTS.md', 'Do not guess at APIs, file paths, schemas, configuration, environment variables, or deployment behavior', 'must prohibit unverified API/path/config assumptions');
requireText('AGENTS.md', 'Make the smallest coherent change that solves the requested problem', 'must require minimal scoped changes');
requireText('AGENTS.md', 'Never delete, weaken, skip, or rewrite tests to make a change pass', 'must prohibit test weakening to satisfy CI');
requireText('AGENTS.md', 'Anti-dumb-mistake finish check', 'must require an explicit pre-finish correctness checklist');
requireText('AGENTS.md', 'Did I actually run the relevant test/build/QA, or am I assuming it works?', 'must require execution evidence instead of assumption');
requireText('AGENTS.md', 'No filler or self-congratulation', 'must require concise factual completion communication');
requireText('.github/PULL_REQUEST_TEMPLATE.md', 'Equivalent-work preflight', 'PRs must record duplicate-work preflight evidence');
requireText('.github/PULL_REQUEST_TEMPLATE.md', 'Durable state / queue updated', 'PRs must explicitly reconcile durable state when reality changed');

if (failures.length) {
  console.error('Codex discipline QA failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('Codex discipline QA passed.');
