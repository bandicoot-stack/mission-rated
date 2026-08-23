import { readFileSync } from 'node:fs';

const home = readFileSync('home-priority.js','utf8');
const fall = readFileSync('fall.html','utf8');
const build = readFileSync('scripts/build-all.mjs','utf8');
const errors=[];
const requireToken=(source,token,message)=>{if(!source.includes(token))errors.push(message)};

requireToken(home,"['fall','Fall Deals & Finds']",'homepage seasonal slot must include Fall Deals & Finds');
requireToken(home,"location.href='/fall.html'",'homepage fall action must route to /fall.html');
requireToken(build,"'fall.html'",'release build must copy fall.html');
for(const token of ['Historic Greenbrier Farms','Hunt Club Farm','Bergey’s Breadbasket','Bluebird Gap Farm Fall Festival','LAST CHECKED AUGUST 23, 2026']) requireToken(fall,token,`fall page missing ${token}`);
for(const host of ['historicgreenbrierfarms.com','huntclubfarm.com','bergeysbreadbasket.com','hampton.gov']) requireToken(fall,host,`fall page missing source host ${host}`);
if(!/meta name="description"/.test(fall))errors.push('fall page must include discovery metadata');
if(!/@media\(max-width:820px\)/.test(fall))errors.push('fall page must retain mobile responsive layout');

if(errors.length){
  console.error('Fall Deals & Finds QA failed:');
  for(const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log('Fall Deals & Finds QA passed: seasonal navigation, sources, freshness, build inclusion, and mobile metadata are guarded.');
