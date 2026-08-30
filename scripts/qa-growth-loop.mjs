import { readFile } from 'node:fs/promises';
const must=async(path,needles)=>{const s=await readFile(path,'utf8');for(const n of needles)if(!s.includes(n))throw new Error(`${path} missing ${n}`)};
await must('family-pass.html',['Your Military Family Pass.','public-explore','family_pass_shared','utm_campaign']);
await must('growth-loop.js',['Free Military Family Pass','family_pass_cta_clicked','sessionStorage']);
await must('weekend-brief.js',['Open your free Family Pass','weekend_brief_referral_shared','weekend_brief_signup_confirmed','Bring me the Brief',"main.insertAdjacentElement('beforebegin',shell)"]);
await must('scripts/build-all.mjs',["'family-pass.html'","'growth-loop.js'",'/growth-loop.js']);
await must('dist/family-pass.html',['growth-loop.js','brand.js']);
await must('dist/index.html',['growth-loop.js','weekend-brief.js']);
console.log('Family Pass acquisition loop QA passed');
