import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const errors=[];
const fail=message=>errors.push(message);
const read=path=>existsSync(path)?readFileSync(path,'utf8'):'';

const sandbox={window:{},Object};
try{vm.runInNewContext(read('featured-partners.js'),sandbox,{filename:'featured-partners.js'});}catch(error){fail(`featured-partners.js failed to evaluate: ${error.message}`);}
const partners=sandbox.window.MRFeaturedPartners?.all||[];
const valhalla=partners.find(partner=>partner.slug==='valhalla-barbell-club');
const huntClub=partners.find(partner=>partner.slug==='hunt-club-farm');

if(!valhalla) fail('Valhalla Barbell Club is missing from featured partner data');
else {
  const expected={
    name:'Valhalla Barbell Club',
    partnerSubheadline:'Veteran-owned. Military-focused. Built around strength and service.',
    tagline:'More than a gym. A place to train, grow, and face your wolf.',
    intro:'Valhalla Barbell Club is a veteran-owned private gym in Virginia Beach focused on helping people build themselves mentally, physically, and emotionally.',
    services:'From small-group personal training to coaching, nutrition guidance, and 24/7 access, Valhalla is built for people who want to train with purpose.',
    militaryOfferText:'For military members: 10% off month-to-month membership, no sign-up or other fees, and your first month is free.',
    featuredDescription:'Chris Jordan brings 28 years of military service to Valhalla, where the mission is bigger than fitness: help people build strength, resilience, and confidence.',
    standard:'Private. PREMIUM. Built for training and putting in the work.',
    wolfLine:'Face Your Wolf. Whatever the challenge, Valhalla is built to help you meet it head-on.',
    closingHeading:'Face Your Wolf. Start here.',
    primaryCtaLabel:'Get Military Offer',
    secondaryCtaLabel:'Visit Valhalla Barbell Club'
  };
  for(const [key,value] of Object.entries(expected)) if(valhalla[key]!==value) fail(`Valhalla ${key} does not match founder-approved copy`);
  if(valhalla.veteranOwned!==true) fail('Valhalla must be marked veteran-owned');
  if(valhalla.directlyConfirmed!==true) fail('Valhalla must be marked directly confirmed');
  if(valhalla.logo) fail('Valhalla must not hotlink or invent a logo before a canonical partner asset is stored');
  if(valhalla.businessUrl!=='https://www.valhallabarbellclubvb.com/') fail('Valhalla CTA must use the official business website');
}

if(!huntClub) fail('Hunt Club Farm is missing from featured partner data');
else {
  const offerTokens=[
    '10% off Petting Farm/TreeWalk admission on Sundays',
    '10% off Farm Market purchases on Sundays',
    '$2 off Harvest Fair admission on Sundays in October',
    '$10 off Halloween Festival military admission'
  ];
  if(huntClub.directlyConfirmed!==true) fail('Hunt Club Farm must be marked directly confirmed');
  if(huntClub.veteranOwned!==false) fail('Hunt Club Farm must not be represented as veteran-owned without confirmation');
  if(huntClub.logo) fail('Hunt Club Farm must use the logo fallback until a canonical partner asset is stored');
  if(huntClub.businessUrl!=='https://www.huntclubfarm.com/') fail('Hunt Club Farm CTA must use the official business website');
  if(huntClub.location!=='2388 London Bridge Rd, Virginia Beach, VA 23456') fail('Hunt Club Farm location must match the official business address');
  for(const token of offerTokens){
    if(!huntClub.militaryOfferText?.includes(token)) fail(`Hunt Club Farm militaryOfferText missing confirmed term: ${token}`);
    if(!huntClub.terms?.includes(token)) fail(`Hunt Club Farm terms missing confirmed term: ${token}`);
  }
  if(!huntClub.terms?.includes('Final eligibility, redemption method, and exclusions are pending partner confirmation.')) fail('Hunt Club Farm must preserve pending eligibility/redemption/exclusion state');
}

for(const slug of ['yorktown-tools','compass-rose-realty-co','valhalla-barbell-club']) if(!partners.some(partner=>partner.slug===slug)) fail(`existing featured partner regression: ${slug} missing`);

const page=read('featured.html');
for(const token of ['partnerSubheadline','militaryOfferText','partner.standard','partner.wolfLine','primaryCtaLabel','data-deal-action="outbound"']) if(!page.includes(token)) fail(`featured.html missing rich partner renderer token: ${token}`);
if(page.includes('data-deal-action="get-deal"')) fail('featured.html must not classify generic merchant-site clicks as deal redemption intent');
if(!page.includes('Featured placement identifies a confirmed partner or noteworthy military benefit; it never improves a business’s score')) fail('featured trust disclosure changed or is missing');

if(errors.length){
  console.error('Featured partner QA failed:');
  for(const error of [...new Set(errors)]) console.error(` - ${error}`);
  process.exit(1);
}
console.log('Featured partner QA passed: Valhalla approved copy, Hunt Club Farm confirmed offers/trust state, outbound CTA semantics, and existing partner presence verified.');
