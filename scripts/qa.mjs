import { existsSync, readFileSync, readdirSync } from 'node:fs';

const root='.';
const dist='dist';
const errors=[];
const htmlNames=['index.html','military-value.html','schools.html','bases.html','neighborhoods.html','community.html','buy-a-car.html','support.html','business.html'];
const releaseFiles=[
  ...htmlNames,
  'sitemap.xml','robots.txt','feedback.js','rankings.js','quick-vote.js','reviews.js','community.js','lifestyle-nav.js',
  'support-ui.js','auto-dealers.js','provenance.js','car-embed.js','support-embed.js','value-priority.js','live-trust-controls.js',
  'discovery-sort.js','detail-links.js','evidence-freshness.js','evidence-coverage.js'
];

const read=(path)=>existsSync(path)?readFileSync(path,'utf8'):'';
const requireFile=(path,label=path)=>{ if(!existsSync(path)) errors.push(`missing ${label}`); };
const requireTokens=(text,tokens,label)=>{ for(const token of tokens) if(!text.includes(token)) errors.push(`${label} missing ${token}`); };

for(const name of releaseFiles){
  requireFile(name,`source release file: ${name}`);
  requireFile(`${dist}/${name}`,`built release file: dist/${name}`);
}

try{ JSON.parse(read('vercel.json')); }catch(error){ errors.push(`invalid vercel.json: ${error.message}`); }

const feedback=read('feedback.js');
const rankings=read('rankings.js');
const quick=read('quick-vote.js');
const reviews=read('reviews.js');
const lifestyle=read('lifestyle-nav.js');
const supportUi=read('support-ui.js');
const auto=read('auto-dealers.js');
const trust=read('live-trust-controls.js');
const discovery=read('discovery-sort.js');
const freshness=read('evidence-freshness.js');
const coverage=read('evidence-coverage.js');

requireTokens(feedback,['submit-beta-feedback'],'feedback');
requireTokens(rankings,['MR OPEN'],'rankings');
requireTokens(quick,['quick-rank-vote','▲','▼'],'quick sentiment controls');
requireTokens(reviews,['submit-item-review','Pending / Unverified'],'reviews');
requireTokens(lifestyle,['LIVE','SUPPORT','SAVE','/support','/buy-a-car','/community'],'lifestyle navigation');
requireTokens(supportUi,['MR Building','Official Source Verified','supportQ'],'support hub');
requireTokens(auto,['Official Source Verified','User Verified','Unsourced public ratings are suppressed','Military evidence first','public-auto-dealers','External ratings never become Mission Rated scores.','Building'],'auto dealer trust UX');
requireTokens(trust,['Official source','Military value','Public rating','Fresh evidence','Newest source','Live better. Get support. Save more.','public-explore','mrEvidenceDate'],'live trust controls');
if(!trust.replaceAll(' ','').includes('age<=30')) errors.push('fresh evidence filter must enforce 30-day window');
if(trust.includes("className='mrFreshness'")||trust.includes('className="mrFreshness"')) errors.push('trust script must not shadow evidence-freshness badge class');
requireTokens(discovery,['Strongest military value','Highest sourced public rating','Most public reviews','Official-source evidence first','Strongest verified value','Most recently verified','MR Building','Public rating sourced','public-explore'],'discovery sorting');
requireTokens(freshness,['Evidence fresh','Evidence ${d}d old','Freshness reflects the newest stored source observation','public-explore'],'evidence freshness UX');
requireTokens(coverage,['public-explore'],'evidence coverage UX');

for(const name of htmlNames){
  const built=read(`${dist}/${name}`);
  requireTokens(built,['/feedback.js','/lifestyle-nav.js'],`dist/${name}`);
}

requireTokens(read(`${dist}/index.html`),['/live-trust-controls.js','/value-priority.js','/discovery-sort.js','/evidence-freshness.js','/evidence-coverage.js'],'dist/index.html');
requireTokens(read(`${dist}/support.html`),['/support-ui.js','/support-embed.js'],'dist/support.html');
requireTokens(read(`${dist}/buy-a-car.html`),['/auto-dealers.js','/car-embed.js'],'dist/buy-a-car.html');
for(const name of ['index.html','military-value.html','schools.html','bases.html']) requireTokens(read(`${dist}/${name}`),['/evidence-freshness.js','/detail-links.js'],`dist/${name}`);
for(const name of ['index.html','military-value.html','schools.html','bases.html','neighborhoods.html']) requireTokens(read(`${dist}/${name}`),['/reviews.js'],`dist/${name}`);

for(const name of readdirSync(root).filter((name)=>name.endsWith('.html')).sort()){
  const text=read(name);
  const low=text.toLowerCase();
  if(!low.includes('<html')||!low.includes('lang="en"')) errors.push(`${name}: missing lang`);
  if(!low.includes('name="viewport"')) errors.push(`${name}: missing viewport`);
  if(low.includes('http://')) errors.push(`${name}: insecure URL`);
  const tags=text.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)||[];
  for(const tag of tags){
    const lower=tag.toLowerCase();
    if(!/rel=["'][^"']*noopener[^"']*["']/.test(lower)) errors.push(`${name}: target blank missing noopener`);
  }
}

const sitemap=read('sitemap.xml');
for(const route of ['/military-value','/schools','/bases','/neighborhoods','/community','/buy-a-car','/support']) if(!sitemap.includes(route)) errors.push(`sitemap missing ${route}`);

if(errors.length){
  console.error('Mission Rated QA failed:');
  for(const error of [...new Set(errors)].sort()) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Mission Rated QA passed: build artifact, trust states, sourced dealer discovery, support, reviews, evidence freshness, routing, mobile navigation, and release files.');
