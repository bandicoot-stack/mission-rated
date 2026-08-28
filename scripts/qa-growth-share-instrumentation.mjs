import fs from 'node:fs';

const analytics = fs.readFileSync(new URL('../analytics.js', import.meta.url), 'utf8');
const eventApi = fs.readFileSync(new URL('../api/event.js', import.meta.url), 'utf8');

const failures = [];

if (!eventApi.includes("'share_action'")) failures.push('api/event.js must allow share_action');
if (!analytics.includes("send('share_action'")) failures.push('analytics.js must emit share_action for share controls');
if (!analytics.includes('window.mrReferralUrl')) failures.push('analytics.js must expose referral URL generation');
if (!analytics.includes("dest.origin!==location.origin")) failures.push('referral tokens must remain same-origin only');

if (failures.length) {
  console.error(`Growth share instrumentation QA failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Growth share instrumentation QA passed.');
