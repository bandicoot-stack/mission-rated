import { readFileSync } from 'node:fs';

const analytics = readFileSync('analytics.js', 'utf8');
const share = readFileSync('deal-share.js', 'utf8');
const eventApi = readFileSync('api/event.js', 'utf8');
const errors = [];

if (!analytics.includes("send('share_action'")) errors.push('shared analytics must retain click-level share_action intent');
if (analytics.includes("send('share_completed'")) errors.push('generic click analytics must not fabricate completed-share evidence');
if (!eventApi.includes("'share_completed'")) errors.push('server event allowlist must accept share_completed');
if (!share.includes("window.mrTrack?.('share_completed'")) errors.push('share helper must emit share_completed only after a successful native share/copy operation');
if (!share.includes("if(err?.name==='AbortError')")) errors.push('cancelled native shares must remain distinguishable from completion');
if (/share_completed[^\n]*\burl\s*:/.test(share)) errors.push('share_completed must not persist generated referral URLs');

const successIndex = share.indexOf("window.mrTrack?.('share_completed'");
const catchIndex = share.indexOf('}catch(err){');
if (successIndex < 0 || catchIndex < 0 || successIndex > catchIndex) errors.push('share_completed must be emitted in the successful operation path before error/cancel handling');

if (errors.length) {
  console.error('Share completion QA failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Share completion QA passed: intent and completed-operation evidence remain separate, cancellations do not count, and referral URLs are not persisted.');
