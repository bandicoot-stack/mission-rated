import { readFileSync } from 'node:fs';

const files = [
  'analytics.js',
  'api/event.js',
  'deal-share.js',
  'weekend-brief.js',
  'growth-loop.js'
];

const sources = files.map((path) => [path, readFileSync(path, 'utf8')]);
const errors = [];

// Trust invariant: intent/traffic events are not proof of monetary savings.
// Keep this list aligned with the production analytics event names so the
// regression guard protects the signals we actually emit.
const intentEvents = ['deal_outbound_click', 'claim_action', 'share_action', 'referral_visit'];
for (const [path, source] of sources) {
  for (const event of intentEvents) {
    const eventBlocks = source.match(new RegExp(`.{0,180}${event}.{0,500}`, 'gs')) || [];
    for (const block of eventBlocks) {
      if (/amount_cents|savings_(?:amount|cents|value)|verified_savings|dollars_saved/i.test(block)) {
        errors.push(`${path}: ${event} must not be coupled to a savings amount or verified-savings write`);
      }
    }
  }
}

// Guard against common copy/metric shortcuts that overstate attribution.
for (const [path, source] of sources) {
  if (/deal_(?:outbound_)?clicks?\s*[*+]\s*\$?\d+/i.test(source)) errors.push(`${path}: deal outbound clicks must not be converted into dollars saved`);
  if (/claim_actions?\s*[*+]\s*\$?\d+/i.test(source)) errors.push(`${path}: claim actions must not be converted into dollars saved`);
  if (/shares?\s*[*+]\s*\$?\d+/i.test(source)) errors.push(`${path}: shares must not be converted into dollars saved`);
}

if (errors.length) {
  console.error('Savings ledger QA failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Savings ledger QA passed: outbound intent and referral signals remain separate from defensible monetary savings.');
