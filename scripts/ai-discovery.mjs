import { readdir, readFile, writeFile } from 'node:fs/promises';

const SITE='https://www.missionratedhq.com';
const files=(await readdir('dist')).filter(f=>f.endsWith('.html'));
const descriptions={
  'index.html':'Mission Rated helps military families in Hampton Roads find today’s deals, local military savings, trusted places, businesses, schools, events, PCS resources and local intelligence.',
  'savings.html':'Current source-backed military discounts, local deals and everyday savings for military families in Hampton Roads, Virginia.',
  'gas.html':'Current Hampton Roads gas-price benchmarks and fuel savings information for military families.',
  'labor-day.html':'Mission Rated Labor Day 2026 guide for military families in Hampton Roads: free events, military value, travel notes and things to book early.',
  'this-week.html':'Current Hampton Roads events and activities for military families, with source-backed eligibility, dates and event details.',
  'local-intel.html':'Source-backed Hampton Roads local intelligence and creator discovery for military families.',
  'schools.html':'Hampton Roads school discovery for military families using official education evidence and source-backed Purple Star information.',
  'bases.html':'Hampton Roads installation, PCS, relocation, school liaison and military-family support intelligence.',
  'neighborhoods.html':'Hampton Roads neighborhood intelligence for military families evaluating where to live.',
  'buy-a-car.html':'Military-focused car buying intelligence, dealer discovery and source-backed savings for Hampton Roads families.',
  'support.html':'Source-backed support resources for service members, veterans, spouses and military families in Hampton Roads.',
  'medical.html':'Military-family medical and healthcare resource discovery across Hampton Roads.',
  'business.html':'Military-friendly local business discovery in Hampton Roads with source provenance and trust signals.',
  'events.html':'Hampton Roads events and special activities relevant to military families.',
  'sources.html':'Mission Rated methodology, source provenance, verification rules and trust standards.'
};
const titles={
  'index.html':'Mission Rated | Military Deals & Local Intelligence in Hampton Roads',
  'savings.html':'Military Deals & Savings in Hampton Roads | Mission Rated',
  'gas.html':'Hampton Roads Gas Prices | Mission Rated',
  'labor-day.html':'Labor Day 2026 Hampton Roads Military Family Guide | Mission Rated',
  'this-week.html':'Things To Do This Week in Hampton Roads | Mission Rated',
  'local-intel.html':'Hampton Roads Local Intel | Mission Rated',
  'schools.html':'Hampton Roads Schools for Military Families | Mission Rated',
  'bases.html':'Hampton Roads PCS & Base Guide | Mission Rated',
  'neighborhoods.html':'Hampton Roads Neighborhoods for Military Families | Mission Rated',
  'buy-a-car.html':'Military Car Buying in Hampton Roads | Mission Rated'
};
function pathFor(file){return file==='index.html'?'':`/${file.replace(/\.html$/,'')}`}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
for(const file of files){
  const p=`dist/${file}`;
  let html=await readFile(p,'utf8');
  const canonical=`${SITE}${pathFor(file)}`;
  const title=titles[file]||((html.match(/<title>([^<]+)<\/title>/i)||[])[1]||'Mission Rated');
  const description=descriptions[file]||((html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)||[])[1]||'Source-backed military-family discovery for Hampton Roads, Virginia.');
  html=html.replace(/<link\s+rel="canonical"[^>]*>/ig,'').replace(/<meta\s+name="robots"[^>]*>/ig,'');
  const ld={
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'Organization','@id':`${SITE}/#organization`,name:'Mission Rated',url:`${SITE}/`,description:'Source-backed military-family discovery, savings and local intelligence for Hampton Roads, Virginia.'},
      {'@type':'WebSite','@id':`${SITE}/#website`,url:`${SITE}/`,name:'Mission Rated',publisher:{'@id':`${SITE}/#organization`},inLanguage:'en-US'},
      {'@type':'WebPage','@id':`${canonical}#webpage`,url:canonical,name:title,description,isPartOf:{'@id':`${SITE}/#website`},about:{'@id':`${SITE}/#organization`},inLanguage:'en-US'}
    ]
  };
  const meta=`<link rel="canonical" href="${esc(canonical)}"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"><meta property="og:type" content="website"><meta property="og:site_name" content="Mission Rated"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><script type="application/ld+json">${JSON.stringify(ld).replace(/</g,'\\u003c')}</script>`;
  html=html.replace('</head>',`${meta}</head>`);
  await writeFile(p,html);
}
console.log(`AI discovery metadata added to ${files.length} HTML pages`);
