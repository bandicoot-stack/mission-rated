import { readFileSync } from 'node:fs';

const source=readFileSync('home-priority.js','utf8');
const required=[
  'Verify & use deal ↗',
  'Official website ↗',
  'Visit business ↗',
  'SOURCE-BACKED',
  'BUSINESS SITE',
  'mrDealAction',
  'data-deal-action="get-deal"',
  'data-deal-source="verified-source"',
  'searchText=',
  'filterDeals=',
  "searchInput?.addEventListener('input'",
  'data-clear-deal-search',
  'No deals match'
];
const errors=required.filter(token=>!source.includes(token));
if(errors.length){
  console.error('Homepage deal CTA/search QA failed:');
  for(const token of errors) console.error(` - missing ${token}`);
  process.exit(1);
}
if(!source.includes('website&&website!==source')){
  console.error('Homepage deal CTA QA failed: official website must remain distinct from the verified offer source.');
  process.exit(1);
}
if(!source.includes('!source&&website')){
  console.error('Homepage deal CTA QA failed: business-site fallback must only render when no offer source exists.');
  process.exit(1);
}
const searchCoverage=[
  'todayDeals=filterDeals(todayBase)',
  'localDeals=filterDeals(shuffle(pool.filter(isLocal)))',
  'everydayDeals=filterDeals(shuffle(all))'
];
if(searchCoverage.some(token=>!source.includes(token))){
  console.error('Homepage deal search QA failed: Today, Local, and Everyday deal grids must all use the visible homepage query.');
  process.exit(1);
}
console.log('Homepage deal QA passed: trust actions and functional search/clear behavior are explicit.');
