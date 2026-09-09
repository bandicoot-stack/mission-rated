import { readFile } from 'node:fs/promises';

const build=await readFile('scripts/build-all.mjs','utf8');
const ui=await readFile('school-maturity.js','utf8');
for(const token of ['/school-maturity.js','schools.html','school.html'])if(!build.includes(token))throw new Error(`school maturity build wiring missing: ${token}`);
for(const token of ['Compare schools','PCS DECISION SUPPORT','View school decision brief','MISSION RATED • PCS DECISION BRIEF','Elementary','Middle','High','schools:zero-results','schools:compare','target_type:\'school\''])if(!ui.includes(token))throw new Error(`school maturity UX/analytics missing: ${token}`);
if(!ui.includes("window.mrTrack?.(event,extra)"))throw new Error('school maturity must use first-party analytics contract');
if(!ui.includes('public-explore'))throw new Error('school maturity must use live public school data');
if(ui.includes('GreatSchools')||ui.includes('Niche rating'))throw new Error('school maturity must not fabricate or import unsupported third-party scoring');
console.log('School maturity QA passed.');
