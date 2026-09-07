import { readFileSync } from 'node:fs';

const eventApi = readFileSync('api/event.js', 'utf8');
const ingest = readFileSync('supabase/functions/growth-event-ingest/index.ts', 'utf8');
const requiredDurableEvents = [
  'deal_outbound_click',
  'share_action',
  'share_completed',
  'claim_action',
  'weekend_brief_signup_attempt',
  'weekend_brief_signup_confirmed'
];

const failures = [];
for (const event of requiredDurableEvents) {
  const token = `'${event}'`;
  if (!eventApi.includes(token)) failures.push(`api/event.js does not accept ${event}`);
  if (!ingest.includes(token)) failures.push(`growth-event-ingest does not accept ${event}`);
}

if (failures.length) {
  console.error('Growth ingest contract QA failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('Growth ingest contract QA passed: critical Growth events are accepted at both durable persistence boundaries.');
