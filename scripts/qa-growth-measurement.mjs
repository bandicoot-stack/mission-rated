import { readFileSync } from 'node:fs';

const analytics = readFileSync('analytics.js', 'utf8');
const eventApi = readFileSync('api/event.js', 'utf8');
const ingest = readFileSync('supabase/functions/growth-event-ingest/index.ts', 'utf8');
const laborDay = readFileSync('labor-day.html', 'utf8');
const missionControlMetrics = readFileSync('supabase/functions/mission-control-metrics/index.ts', 'utf8');
const packageJson = readFileSync('package.json', 'utf8');
const share = readFileSync('deal-share.js', 'utf8');
const weekendBrief = readFileSync('weekend-brief.js', 'utf8');
const weekendBriefSignup = readFileSync('supabase/functions/weekend-brief-signup/index.ts', 'utf8');

const errors = [];
const requireToken = (source, token, message) => {
  if (!source.includes(token)) errors.push(message);
};

for (const event of [
  'referral_visit','return_visit','deal_click','share_action','claim_action',
  'weekend_brief_signup_attempt','weekend_brief_signup_confirmed'
]) {
  requireToken(eventApi, `'${event}'`, `server event allowlist is missing ${event}`);
}

for (const field of [
  'target_type','target_id','deal_source','share_method','signup_surface',
  'utm_source','utm_medium','utm_campaign','referral_code'
]) {
  requireToken(eventApi, `${field}:`, `server event payload is missing sanitized ${field}`);
}

requireToken(eventApi, 'isSameOriginBrowserRequest', 'server event endpoint must retain same-origin browser protection');
requireToken(eventApi, 'if (!origin) return false', 'server event endpoint must reject originless metric submissions');
requireToken(eventApi, 'referral_code: cleanUuid(body.referral_code)', 'referral attribution must accept only pseudonymous UUID tokens');
requireToken(eventApi, "process.env.VERCEL_ENV !== 'production'", 'preview traffic must not persist into the production Growth store');
requireToken(eventApi, "import { getVercelOidcToken } from '@vercel/oidc'", 'production Growth persistence must use the supported Vercel OIDC runtime helper');
requireToken(eventApi, 'await getVercelOidcToken({', 'production Growth persistence must acquire Vercel OIDC identity at runtime');
requireToken(eventApi, "project: 'prj_mk9F2l6zlQ1oqWEh8DfluKKqMBQO'", 'OIDC token acquisition must bind to the Mission Rated Vercel project');
requireToken(eventApi, "team: 'team_keaLn1aS3rp2RW0ewC2SwKJV'", 'OIDC token acquisition must bind to the Mission Rated Vercel team');
requireToken(packageJson, '"@vercel/oidc": "3.8.5"', 'Vercel OIDC helper dependency must be pinned');
requireToken(eventApi, 'growth-event-ingest', 'accepted production events must route to the authoritative ingest function');
requireToken(eventApi, "return res.status(204).end()", 'event ingestion should acknowledge success only after the chosen persistence path');
if (eventApi.includes('process.env.VERCEL_OIDC_TOKEN')) errors.push('event API must not assume a raw VERCEL_OIDC_TOKEN environment variable');
if (eventApi.includes('SUPABASE_SERVICE_ROLE_KEY')) errors.push('Vercel event API must not require a copied Supabase service-role credential');
if (eventApi.includes('verified_savings')) errors.push('browser analytics ingestion must never write or derive verified_savings');

requireToken(ingest, 'createRemoteJWKSet', 'Growth ingest must verify Vercel OIDC signatures against JWKS');
requireToken(ingest, 'jwtVerify', 'Growth ingest must cryptographically verify the Vercel OIDC token');
requireToken(ingest, 'environment:production', 'Growth ingest identity must be restricted to the production Vercel environment');
requireToken(ingest, 'payload.project_id !== PROJECT_ID', 'Growth ingest must bind authorization to the Mission Rated Vercel project');
requireToken(ingest, 'payload.owner_id !== OWNER_ID', 'Growth ingest must bind authorization to the Mission Rated Vercel team');
requireToken(ingest, ".from('product_events').insert(row)", 'Growth ingest must persist into authoritative product_events');
requireToken(ingest, "ingestion: 'vercel_oidc_v1'", 'durable rows must record bounded ingestion provenance');
if (ingest.includes('verified_savings')) errors.push('Growth ingest must never write or derive verified_savings');

requireToken(missionControlMetrics, 'founder_authorization_not_configured', 'founder/Growth metrics must remain withdrawn until founder authorization is configured');
requireToken(missionControlMetrics, 'status: 403', 'withdrawn founder/Growth metrics endpoint must fail closed');
if (missionControlMetrics.includes('SUPABASE_SERVICE_ROLE_KEY')) errors.push('withdrawn founder/Growth metrics endpoint must not regain service-role data access');
if (missionControlMetrics.includes(".from('product_events')") || missionControlMetrics.includes(".from(\"product_events\")")) errors.push('withdrawn founder/Growth metrics endpoint must not query authoritative Growth events');
if (missionControlMetrics.includes('verified_savings')) errors.push('withdrawn founder/Growth metrics endpoint must not expose realized savings before founder authorization exists');

requireToken(analytics, "send('weekend_brief_signup_attempt'", 'Weekend Brief submit must record attempt, not confirmed signup');
const submitHandler = analytics.match(/document\.addEventListener\('submit',[\s\S]*?\},true\);/)?.[0] || '';
if (!submitHandler) {
  errors.push('analytics.js must retain a generic submit handler for Weekend Brief signup attempts');
} else if (/send\(['"]weekend_brief_signup_confirmed['"]/.test(submitHandler)) {
  errors.push('analytics.js must not confirm Weekend Brief signup from a generic browser submit handler');
}
if (/mrTrack\?\.\(['"]weekend_brief_signup_attempt['"]/.test(weekendBrief)) {
  errors.push('Weekend Brief local submit handler must not duplicate the generic analytics signup-attempt event');
}
requireToken(analytics, 'window.mrConfirmWeekendBriefSignup', 'confirmed Weekend Brief conversion must remain behind the explicit authoritative-success helper');
requireToken(weekendBriefSignup, 'existing?.status === "unsubscribed"', 'Weekend Brief backend must preserve explicit unsubscribe state');
requireToken(weekendBriefSignup, 'resubscribe_required', 'Weekend Brief backend must return a distinct resubscribe-required state');
requireToken(weekendBrief, "res.status===409&&body.error==='resubscribe_required'", 'Weekend Brief UI must handle resubscribe-required before generic success/error handling');
requireToken(weekendBrief, 'previously unsubscribed', 'Weekend Brief UI must explain that an unsubscribed address was not reactivated');
if (/mrTrack\?\.\(['"]weekend_brief_signup_confirmed['"]/.test(weekendBrief)) {
  errors.push('Weekend Brief UI must not emit confirmed signup from an already-active address; confirmation is reserved for authoritative inbox-confirmation success');
}
requireToken(weekendBrief, 'already-active address is an idempotent lookup', 'Weekend Brief UI must document that already-subscribed responses are not new conversion evidence');

requireToken(laborDay, 'data-weekend-brief="true"', 'Labor Day signup must participate in generic Weekend Brief attempt attribution');
requireToken(laborDay, 'data-signup-surface="labor-day-2026"', 'Labor Day signup must preserve explicit signup-surface attribution');
requireToken(laborDay, "res.status===409&&body.error==='resubscribe_required'", 'Labor Day signup must handle resubscribe-required before generic success/error handling');
requireToken(laborDay, "res.status===503&&body.error==='confirmation_required'", 'Labor Day signup must handle confirmation-required before generic success/error handling');
requireToken(laborDay, 'previously unsubscribed', 'Labor Day signup must explain that an unsubscribed address was not reactivated');
requireToken(laborDay, 'won’t mark you subscribed without verifying your email first', 'Labor Day signup must fail closed when inbox confirmation is unavailable');
requireToken(laborDay, 'body.already_subscribed', 'Labor Day signup must distinguish an already-active address from a new signup response');
if (/mrTrack\?\.\(['"]weekend_brief_signup_confirmed['"]/.test(laborDay)) {
  errors.push('Labor Day signup must not emit confirmed conversion evidence from a browser success or already-active response');
}
if (/You’re in\. We’ll bring the Labor Day updates to you\./.test(laborDay)) {
  errors.push('Labor Day signup must not claim subscription success without authoritative inbox confirmation');
}

requireToken(share, "window.mrTrack('share_action'", 'successful deal share must emit share_action');
requireToken(share, "if(err?.name==='AbortError')", 'cancelled native shares must not be counted as completed shares');
if (/mrTrack\(['"]share_action['"][^\n]*\burl\s*:/.test(share)) errors.push('share_action must not send generated referral URLs to analytics');

if (errors.length) {
  console.error('Growth measurement QA failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Growth measurement QA passed: supported OIDC durable persistence, attribution, share outcomes, signup consent contracts, founder-metrics withdrawal, savings separation, and origin integrity are guarded.');
