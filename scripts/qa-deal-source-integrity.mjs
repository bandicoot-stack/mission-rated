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

// Exact-offer contracts are intentionally narrow and reviewable. They exist for
// cases where one merchant has multiple concurrent promotions and merchant-path
// validation alone cannot prove the linked page supports the displayed offer.
const exactSourceContracts = new Map([
  [
    'Norfolk|Columbia Factory Store|Additional 20% off for military and first responders with valid ID',
    '/outlet/norfolk/stores/columbia-factory-store/stream/thank-you-military-and-first-responders-6288463'
  ],
  [
    'Norfolk|Columbia Factory Store|Clearance event up to 70% off',
    '/outlet/norfolk/stores/columbia-factory-store/stream/clearance-event--up-to-70-off-6285727'
  ]
]);

// Some merchant pages legitimately contain several offer lines on one source
// page. Those shared-source cases must be explicit rather than silently allowed.
const reviewedSharedSourceGroups = new Map([
  [
    'Norfolk|Tommy Hilfiger',
    '/outlet/norfolk/stores/tommy-hilfiger/stream/50-off-almost-everything-6288642'
  ]
]);

const merchantTokens = business => business
  .toLowerCase()
  .replace(/factory house|factory store|new york|bostonian|b'gosh|factory|outlet|store/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .split(/\s+/)
  .filter(token => token.length > 1);

const locationSlug = location => location.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const finalSources = new Map();

for (const deal of deals) {
  const key = dealKey(deal);
  const source = sourceFixes.get(key) || deal.source;
  finalSources.set(key, source);

  let url;
  try {
    url = new URL(source);
  } catch {
    failures.push(`${key}: invalid source URL`);
    continue;
  }

  const exactContract = exactSourceContracts.get(key);
  if (exactContract && url.pathname !== exactContract) {
    failures.push(`${key}: exact-offer source '${url.pathname}' does not match reviewed contract '${exactContract}'`);
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

// Fail closed when a merchant has multiple displayed offers but several of them
// collapse onto one Premium Outlets stream page without an explicit reviewed
// shared-source contract. This catches same-merchant/wrong-offer substitutions
// such as a clearance card accidentally pointing at a military-discount page.
const premiumGroups = new Map();
for (const deal of deals) {
  const key = dealKey(deal);
  const source = finalSources.get(key);
  let url;
  try {
    url = new URL(source);
  } catch {
    continue;
  }
  if (url.hostname !== 'www.premiumoutlets.com') continue;

  const groupKey = `${deal.location}|${deal.business}`;
  const group = premiumGroups.get(groupKey) || [];
  group.push({ key, pathname: url.pathname });
  premiumGroups.set(groupKey, group);
}

for (const [groupKey, group] of premiumGroups) {
  if (group.length < 2) continue;
  const pathCounts = new Map();
  for (const item of group) pathCounts.set(item.pathname, (pathCounts.get(item.pathname) || 0) + 1);
  const duplicates = [...pathCounts.entries()].filter(([, count]) => count > 1);
  if (!duplicates.length) continue;

  const reviewedPath = reviewedSharedSourceGroups.get(groupKey);
  for (const [pathname] of duplicates) {
    if (reviewedPath !== pathname) {
      failures.push(`${groupKey}: multiple distinct offers share unreviewed source '${pathname}'; add exact offer sources or an explicit reviewed shared-source contract`);
    }
  }
}

for (const [key] of exactSourceContracts) {
  if (!inventoryKeys.has(key)) failures.push(`orphan exact-offer source contract does not match a current deal: ${key}`);
}
for (const [groupKey, pathname] of reviewedSharedSourceGroups) {
  const group = premiumGroups.get(groupKey);
  if (!group) {
    failures.push(`orphan reviewed shared-source group does not match current Premium Outlets deals: ${groupKey}`);
    continue;
  }
  if (!group.some(item => item.pathname === pathname)) {
    failures.push(`${groupKey}: reviewed shared-source path '${pathname}' is no longer used by the current inventory`);
  }
}

if (failures.length) {
  console.error('Deal source integrity QA failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`Deal source integrity QA passed for ${deals.length} Labor Day offers after applying ${sourceFixes.size} explicit corrections, ${exactSourceContracts.size} exact-offer contracts, and ${reviewedSharedSourceGroups.size} reviewed shared-source group.`);
