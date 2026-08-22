import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const backend = await readFile(new URL('../supabase/functions/weekend-brief-signup/index.ts', import.meta.url), 'utf8');
const frontend = await readFile(new URL('../weekend-brief.js', import.meta.url), 'utf8');

test('public signup preserves explicit unsubscribe state', () => {
  assert.match(backend, /existing\?\.status === "unsubscribed"/);
  assert.match(backend, /resubscribe_required/);
  assert.doesNotMatch(backend, /\.upsert\(/);
});

test('active duplicate signup is idempotent', () => {
  assert.match(backend, /existing\?\.status === "active"/);
  assert.match(backend, /already_subscribed: true/);
});

test('new signup validates input and preserves anti-abuse controls', () => {
  assert.match(backend, /invalid_email/);
  assert.match(backend, /origin_not_allowed/);
  assert.match(backend, /body\.company/);
  assert.match(backend, /Cache-Control": "no-store/);
  assert.match(backend, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('frontend does not report success for resubscribe-required state', () => {
  const guard = frontend.indexOf("res.status===409&&body.error==='resubscribe_required'");
  const success = frontend.indexOf("You’re in. Your Weekend Brief is headed your way.");
  assert.ok(guard >= 0, 'resubscribe guard must exist');
  assert.ok(success > guard, 'success handling must occur after the resubscribe guard');
  assert.match(frontend, /previously unsubscribed/);
});
