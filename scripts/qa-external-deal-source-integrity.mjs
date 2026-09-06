import { readFileSync } from 'node:fs';

const dealsSource = readFileSync('labor-day-deals.js', 'utf8');
const failures = [];

const dealsMatch = dealsSource.match(/const deals=(\[[\s\S]*?\]);const esc=/);
if (!dealsMatch) {
  console.error('External deal source integrity QA failed:\n- unable to parse Labor Day deal inventory');
  process.exit(1);
}

let deals;
try {
  deals = JSON.parse(dealsMatch[1]);
} catch (error) {
  console.error(`External deal source integrity QA failed:\n- Labor Day deal inventory is not valid JSON: ${error.message}`);
  process.exit(1);
}

const dealKey = deal => `${deal.location}|${deal.business}|${deal.offer}`;

// Premium Outlets offers are governed by qa-deal-source-integrity.mjs.
// These contracts close the remaining gap for the official destination,
// dealer, and retailer sources that do not have a merchant path we can
// validate generically. Equality is intentional: a different page requires
// explicit review before the release gate will accept it.
const exactExternalSourceContracts = new Map([
  ['Virginia Beach|Hunt Club Farm|20% off admission on Labor Day (in-person ticket booth)','https://www.visitvirginiabeach.com/event/labor-day-special-at-hunt-club-farm/11300/'],
  ["Virginia Beach|Dave & Buster's|Free $10 Power Card + 15% off food & non-alcoholic drinks for active-duty/retired military on Monday",'https://www.visitvirginiabeach.com/event/military-mondays/9833/'],
  ['Newport News|Southern Ford|$80 instant discount on four qualifying tires for active/retired military and first responders','https://www.southernfordnewportnews.com/service/service-specials/'],
  ['Newport News|Southern Ford|Up to $125 instant discount on four select tires','https://www.southernfordnewportnews.com/tire-details/'],
  ['Newport News|Southern Ford|Ford employees/retirees: $50 instant service discount on $100+ eligible service','https://www.southernfordnewportnews.com/oil-details/'],
  ['Norfolk|Discount Tire|Up to $100 instant savings on select tire sets','https://www.discounttire.com/store/VA/NORFOLK/s/2209'],
  ['Norfolk|Discount Tire|Up to $100 instant savings on select wheel sets','https://www.discounttire.com/store/VA/NORFOLK/s/2209'],
  ['Norfolk|Discount Tire|Choose $80 instant savings on $799+ qualifying purchase with Discount Tire credit card','https://www.discounttire.com/promotions/labor-day']
]);

const inventoryKeys = new Set(deals.map(dealKey));
const externalDeals = deals.filter(deal => {
  try {
    return new URL(deal.source).hostname !== 'www.premiumoutlets.com';
  } catch {
    failures.push(`${dealKey(deal)}: invalid source URL`);
    return false;
  }
});

for (const deal of externalDeals) {
  const key = dealKey(deal);
  const expected = exactExternalSourceContracts.get(key);
  if (!expected) {
    failures.push(`${key}: external source has no reviewed exact-source contract`);
    continue;
  }
  if (deal.source !== expected) {
    failures.push(`${key}: source '${deal.source}' does not match reviewed contract '${expected}'`);
  }
}

for (const key of exactExternalSourceContracts.keys()) {
  if (!inventoryKeys.has(key)) failures.push(`orphan external exact-source contract does not match a current deal: ${key}`);
}

if (externalDeals.length !== exactExternalSourceContracts.size) {
  failures.push(`external source coverage mismatch: ${externalDeals.length} current external deals vs ${exactExternalSourceContracts.size} reviewed contracts`);
}

if (failures.length) {
  console.error('External deal source integrity QA failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`External deal source integrity QA passed for ${externalDeals.length} non-Premium-Outlets Labor Day offers with exact reviewed source contracts.`);
