import { readFileSync } from 'node:fs';

const analytics = readFileSync('analytics.js', 'utf8');
const errors = [];

const guardedClaim = "if(ctx.target_type==='deal'&&(el.dataset?.dealAction==='claim'||/\\bclaim\\b/.test(text)))return send('claim_action',ctx);";
if (!analytics.includes(guardedClaim)) {
  errors.push('claim_action must be gated to target_type=deal before it can enter Growth measurement');
}

if (/if\(\/claim \(this\|business\|listing\)\|\\bclaim\\b\/\.test\(text\)\)return send\('claim_action',ctx\);/.test(analytics)) {
  errors.push('generic business/listing claim text must not emit the deal claim_action Growth signal');
}

if (/claim_action[^\n]*(redemption|redeemed|verified_savings|savings)/i.test(analytics)) {
  errors.push('deal claim intent must not be represented as redemption or realized savings evidence');
}

if (errors.length) {
  console.error('Claim semantics QA failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Claim semantics QA passed: claim_action is deal-target intent only and is separated from listing ownership, redemption, and savings evidence.');
