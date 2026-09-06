import { readFileSync } from 'node:fs';

const dealsSource = readFileSync('labor-day-deals.js', 'utf8');
const instrumentationSource = readFileSync('labor-day-deal-instrumentation.js', 'utf8');
const failures = [];

const dealsMatch = dealsSource.match(/const deals=(\[[\s\S]*?\]);const esc=/);
if (!dealsMatch) {
  console.error('Deal source integrity QA failed:\n- unable to parse Labor Day deal inventory');
  process.exit(1);
}

let deals;
try {
  deals = JSON.parse(dealsMatch[1]);
} catch (error) {
  console.error(`Deal source integrity QA failed:\n- Labor Day deal inventory is not valid JSON: ${error.message}`);
  process.exit(1);
}

const fixesMatch = instrumentationSource.match(/const sourceFixes=new Map\(\[([\s\S]*?)\]\);/);
if (!fixesMatch) {
  console.error('Deal source integrity QA failed:\n- unable to parse Labor Day source correction map');
  process.exit(1);
}

const sourceFixes = new Map();
const fixEntryPattern = /\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]/g;
let match;
while ((match = fixEntryPattern.exec(fixesMatch[1]))) sourceFixes.set(match[1], match[2]);

const declaredFixCount = (fixesMatch[1].match(/^\s*\[/gm) || []).length;
if (sourceFixes.size !== declaredFixCount) {
  failures.push(`source correction map parser found ${sourceFixes.size} of ${declaredFixCount} declared entries; keep corrections in the reviewable ['key','url'] format`);
}

const dealKey = deal => `${deal.location}|${deal.business}|${deal.offer}`;
const inventoryKeys = new Set(deals.map(dealKey));
for (const key of sourceFixes.keys()) {
  if (!inventoryKeys.has(key)) failures.push(`orphan source correction does not match a current deal: ${key}`);
}

const merchantTokens = business => business
  .toLowerCase()
  .replace(/factory house|factory store|new york|bostonian|b'gosh|factory|outlet|store/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .split(/\s+/)
  .filter(token => token.length > 1);

const locationSlug = location => location.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const deal of deals) {
  const key = dealKey(deal);
  const source = sourceFixes.get(key) || deal.source;
  let url;
  try {
    url = new URL(source);
  } catch {
    failures.push(`${key}: invalid source URL`);
    continue;
  }

  if (url.hostname !== 'www.premiumoutlets.com') continue;
  const pathMatch = url.pathname.match(/\/outlet\/([^/]+)\/stores\/([^/]+)\//);
  if (!pathMatch) {
    failures.push(`${key}: Premium Outlets source is not scoped to an outlet and merchant store path`);
    continue;
  }

  const [, outletPath, storePath] = pathMatch;
  const expectedOutlet = locationSlug(deal.location);
  if (outletPath !== expectedOutlet) {
    failures.push(`${key}: source outlet '${outletPath}' does not match deal location '${expectedOutlet}'`);
  }

  const tokens = merchantTokens(deal.business);
  if (!tokens.length || !tokens.every(token => storePath.includes(token))) {
    failures.push(`${key}: source merchant path '${storePath}' does not match '${deal.business}'`);
  }
}

if (failures.length) {
  console.error('Deal source integrity QA failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`Deal source integrity QA passed for ${deals.length} Labor Day offers after applying ${sourceFixes.size} explicit corrections.`);
