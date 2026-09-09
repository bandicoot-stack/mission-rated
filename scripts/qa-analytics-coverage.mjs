import { readFile } from 'node:fs/promises';

const analytics=await readFile('analytics.js','utf8');
const endpoint=await readFile('api/event.js','utf8');
const required=['page_view','referral_visit','return_visit','deal_outbound_click','share_action','directions_click','review_action','feedback_action','offer_source_click','official_website_click','internal_navigation','weekend_brief_signup_attempt','weekend_brief_signup_confirmed'];
for(const event of required){
  if(!analytics.includes(`'${event}'`)&&!analytics.includes(`send('${event}'`))throw new Error(`analytics.js missing required event: ${event}`);
  if(!endpoint.includes(`'${event}'`))throw new Error(`api/event.js allowlist missing required event: ${event}`);
}
if(!analytics.includes("const ENDPOINT='/api/event'"))throw new Error('analytics must use same-origin /api/event ingestion');
if(!analytics.includes("mr_analytics_optout"))throw new Error('analytics opt-out guard missing');
if(!analytics.includes("window.mrConfirmWeekendBriefSignup"))throw new Error('authoritative signup confirmation hook missing');
if(!endpoint.includes("process.env.VERCEL_ENV !== 'production'"))throw new Error('preview traffic production-store guard missing');
console.log('Analytics coverage QA passed.');
