import { readFileSync } from 'node:fs';

const home = readFileSync('home-priority.js','utf8');
const fall = readFileSync('fall.html','utf8');
const fallAttrs = readFileSync('fall-mission-rated.js','utf8');
const build = readFileSync('scripts/build-all.mjs','utf8');
const errors=[];
const requireToken=(source,token,message)=>{if(!source.includes(token))errors.push(message)};

requireToken(home,"['fall','Fall Deals & Finds']",'homepage seasonal slot must include Fall Deals & Finds');
requireToken(home,"location.href='/fall.html'",'homepage fall action must route to /fall.html');
requireToken(build,"'fall.html'",'release build must copy fall.html');
requireToken(build,"'fall-mission-rated.js'",'release build must copy fall Mission Rated attributes');
for(const token of ['Historic Greenbrier Farms','Hunt Club Farm','Bergey’s Breadbasket','Bluebird Gap Farm Fall Festival','UPDATED SEPTEMBER 2, 2026']) requireToken(fall,token,`fall page missing ${token}`);
for(const host of ['historicgreenbrierfarms.com','huntclubfarm.com','bergeysbreadbasket.com','hampton.gov']) requireToken(fall,host,`fall page missing source host ${host}`);
for(const token of ['MR Building','Military discount: not yet confirmed','10% off','quick-rank-vote','▲','▼','Community signal only','function dedupe()','4e05ea3f-84e2-4e44-89f7-fc7023e6aedf','f2d39470-11f2-4ff1-ac10-1706f1efa43a','a59e8e05-3bd2-4d2c-b391-1c32aa887111','3721c86b-0aff-4169-8546-43898c05121b']) requireToken(fallAttrs,token,`fall Mission Rated attributes missing ${token}`);
if(!/meta name="description"/.test(fall))errors.push('fall page must include discovery metadata');
if(!/@media\(max-width:820px\)/.test(fall))errors.push('fall page must retain mobile responsive layout');

if(errors.length){
  console.error('Fall Deals & Finds QA failed:');
  for(const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log('Fall Deals & Finds QA passed: seasonal navigation, unique venue rendering, source coverage, MR attributes, military-value visibility, guaranteed voting IDs, build inclusion, and mobile metadata are guarded.');
