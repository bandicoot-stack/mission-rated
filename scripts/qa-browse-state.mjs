import { existsSync, readFileSync } from 'node:fs';
const fail=[];const read=p=>existsSync(p)?readFileSync(p,'utf8'):'';
for(const p of ['browse-state.js','dist/browse-state.js'])if(!existsSync(p))fail.push(`missing ${p}`);
const js=read('browse-state.js');for(const t of ['history.replaceState','searchParams','restore(','mr_'])if(!js.includes(t))fail.push(`browse-state missing ${t}`);
for(const page of ['index.html','military-value.html','schools.html','bases.html','buy-a-car.html','support.html','neighborhoods.html','community.html','events.html','sources.html']){const html=read(`dist/${page}`);if(!html.includes('/browse-state.js'))fail.push(`dist/${page} missing browse-state.js`)}
if(fail.length){console.error('Browse-state QA failed:');for(const x of fail)console.error(` - ${x}`);process.exit(1)}
console.log('Browse-state QA passed: persistent shareable filters are included in supported production views.');
