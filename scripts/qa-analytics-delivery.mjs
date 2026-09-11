import { readFileSync } from 'node:fs';

const analytics = readFileSync('analytics.js', 'utf8');
const eventApi = readFileSync('api/event.js', 'utf8');
const errors = [];
const requireToken = (source, token, message) => {
  if (!source.includes(token)) errors.push(message);
};

requireToken(eventApi, "return res.status(503).json({ ok: false, error: 'growth_event_store_unavailable' })", 'persistence failure must remain a non-success HTTP response');
requireToken(analytics, "const key='mr_analytics_delivery_failures'", 'browser analytics must keep a bounded session-local delivery failure record');
requireToken(analytics, 'if(!response.ok)recordDeliveryFailure(eventName,response.status)', 'non-2xx analytics responses must be treated as failed delivery');
requireToken(analytics, ".catch(()=>recordDeliveryFailure(eventName,'network'))", 'network-level analytics failures must be recorded');
requireToken(analytics, 'failures.slice(-10)', 'delivery failure diagnostics must remain bounded');
requireToken(analytics, 'event_name:clean(eventName).slice(0,60)', 'delivery failure diagnostics must record only the bounded event name');

const failureRecorder = analytics.match(/const recordDeliveryFailure=[\s\S]*?\n};/)?.[0] || '';
if (!failureRecorder) errors.push('analytics delivery failure recorder is missing');
if (/payload|visitor|session_id|referrer|utm_|email|target_id/.test(failureRecorder)) errors.push('delivery failure diagnostics must not retain event payload, visitor, attribution, email, or target identifiers');

// Automatic retry remains intentionally forbidden until product_events has a
// durable event-id/idempotency contract. Retrying an ambiguous request today
// could double-count a successfully persisted event whose response was lost.
if (/retry|backoff/i.test(failureRecorder)) errors.push('delivery failure recorder must not implement retry before idempotency exists');

if (errors.length) {
  console.error('Analytics delivery QA failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Analytics delivery QA passed: non-2xx/network failures are observable without payload retention or unsafe automatic retries.');
