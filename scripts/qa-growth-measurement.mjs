import { readFileSync } from 'node:fs';

const analytics = readFileSync('analytics.js', 'utf8');
const eventApi = readFileSync('api/event.js', 'utf8');
const share = readFileSync('deal-share.js', 'utf8');
const weekendBrief = readFileSync('weekend-brief.js', 'utf8');
const weekendBriefSignup = readFileSync('supabase/functions/weekend-brief-signup/index.ts', 'utf8');

const errors = [];
const requireToken = (source, token, message) => {
  if (!source.includes(token)) errors.push(message);
};

for (const event of [
  'referral_visit',
  'return_visit',
  'deal_click',
  'share_action',
  'claim_action',
  'weekend_brief_signup_attempt',
  'weekend_brief_signup_confirmed'
]) {
  requireToken(eventApi, `'${event}'`, `server event allowlist is missing ${event}`);
}

for (const field of [
  'target_type',
  'target_id',
  'deal_source',
  'share_method',
  'signup_surface',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'referral_code'
]) {
  requireToken(eventApi, `${field}:`, `server event payload is missing sanitized ${field}`);
}

requireToken(eventApi, 'isSameOriginBrowserRequest', 'server event endpoint must retain same-origin browser protection');
requireToken(eventApi, 'if (!origin) return false', 'server event endpoint must reject originless metric submissions');
requireToken(eventApi, 'referral_code: cleanUuid(body.referral_code)', 'referral attribution must accept only pseudonymous UUID tokens');
requireToken(analytics, "send('weekend_brief_signup_attempt'", 'Weekend Brief submit must record attempt, not confirmed signup');
const submitHandler = analytics.match(/document\.addEventListener\('submit',[\s\S]*?\},true\);/)?.[0] || '';
if (!submitHandler) {
  errors.push('analytics.js must retain a generic submit handler for Weekend Brief signup attempts');
} else if (/send\(['"]weekend_brief_signup_confirmed['"]/.test(submitHandler)) {
  errors.push('analytics.js must not confirm Weekend Brief signup from a generic browser submit handler');
}
requireToken(analytics, 'window.mrConfirmWeekendBriefSignup', 'confirmed Weekend Brief conversion must remain behind the explicit authoritative-success helper');
requireToken(weekendBriefSignup, 'existing?.status === "unsubscribed"', 'Weekend Brief backend must preserve explicit unsubscribe state');
requireToken(weekendBriefSignup, 'resubscribe_required', 'Weekend Brief backend must return a distinct resubscribe-required state');
requireToken(weekendBrief, "res.status===409&&body.error==='resubscribe_required'", 'Weekend Brief UI must handle resubscribe-required before generic success/error handling');
requireToken(weekendBrief, 'previously unsubscribed', 'Weekend Brief UI must explain that an unsubscribed address was not reactivated');
requireToken(weekendBrief, "weekend_brief_signup_confirmed", 'Weekend Brief UI must record confirmed signup only after authoritative success');
requireToken(share, "window.mrTrack('share_action'", 'successful deal share must emit share_action');
requireToken(share, "if(err?.name==='AbortError')", 'cancelled native shares must not be counted as completed shares');
if (/mrTrack\(['"]share_action['"][^\n]*\burl\s*:/.test(share)) {
  errors.push('share_action must not send generated referral URLs to analytics');
}

if (errors.length) {
  console.error('Growth measurement QA failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Growth measurement QA passed: attribution, share outcomes, signup consent contracts, and origin integrity are guarded.');
