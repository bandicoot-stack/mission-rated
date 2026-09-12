import { readdirSync, readFileSync } from 'node:fs';

const eventApi = readFileSync('api/event.js', 'utf8');
const ingest = readFileSync('supabase/functions/growth-event-ingest/index.ts', 'utf8');
const migrationDir = 'supabase/migrations';
const eventConstraintMigrations = readdirSync(migrationDir)
  .filter((name) => name.endsWith('.sql'))
  .sort()
  .map((name) => ({ name, source: readFileSync(`${migrationDir}/${name}`, 'utf8') }))
  .filter(({ source }) => /add constraint product_events_event_name_check/i.test(source));
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

const extractAllowedEvents = (source, label) => {
  const match = source.match(/const ALLOWED_EVENTS = new Set\(\[([\s\S]*?)\]\);/);
  if (!match) {
    failures.push(`${label} ALLOWED_EVENTS set could not be parsed`);
    return [];
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map(([, event]) => event);
};

const extractConstraintEvents = (source, label) => {
  const match = source.match(/add constraint product_events_event_name_check[\s\S]*?array\[([\s\S]*?)\][\s\S]*?\)\s*\);/i);
  if (!match) {
    failures.push(`${label} product_events_event_name_check could not be parsed`);
    return [];
  }
  return [...match[1].matchAll(/'([^']+)'::text/g)].map(([, event]) => event);
};

const apiEvents = extractAllowedEvents(eventApi, 'api/event.js');
const ingestEvents = extractAllowedEvents(ingest, 'growth-event-ingest');
const latestConstraintMigration = eventConstraintMigrations.at(-1);
if (!latestConstraintMigration) failures.push('no product_events_event_name_check migration found');
const constraintEvents = latestConstraintMigration
  ? extractConstraintEvents(latestConstraintMigration.source, latestConstraintMigration.name)
  : [];
const apiSet = new Set(apiEvents);
const ingestSet = new Set(ingestEvents);
const constraintSet = new Set(constraintEvents);

for (const event of apiSet) {
  if (!ingestSet.has(event)) failures.push(`growth-event-ingest is missing api/event.js event ${event}`);
  if (!constraintSet.has(event)) failures.push(`product_events database constraint does not accept Growth event ${event}`);
}
for (const event of ingestSet) {
  if (!apiSet.has(event)) failures.push(`api/event.js is missing growth-event-ingest event ${event}`);
}
if (apiEvents.length !== apiSet.size) failures.push('api/event.js ALLOWED_EVENTS contains a duplicate event');
if (ingestEvents.length !== ingestSet.size) failures.push('growth-event-ingest ALLOWED_EVENTS contains a duplicate event');
if (constraintEvents.length !== constraintSet.size) failures.push('product_events database constraint contains a duplicate event');

if (failures.length) {
  console.error('Growth ingest contract QA failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`Growth ingest contract QA passed: ${apiEvents.length} Growth events are synchronized across ingestion boundaries and accepted by the latest database constraint migration (${latestConstraintMigration.name}).`);
