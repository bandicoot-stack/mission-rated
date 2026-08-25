import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const errors=[];
const fail=message=>errors.push(message);
const read=path=>existsSync(path)?readFileSync(path,'utf8'):'';

const sandbox={window:{},Object};
try{vm.runInNewContext(read('featured-partners.js'),sandbox,{filename:'featured-partners.js'});}catch(error){fail(`featured-partners.js failed to evaluate: ${error.message}`);}
const partners=sandbox.window.MRFeaturedPartners?.all||[];
const valhalla=partners.find(partner=>partner.slug==='valhalla-barbell-club');

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
    primaryCtaLabel:'Claim Military Offer',
    secondaryCtaLabel:'Visit Valhalla Barbell Club'
  };
  for(const [key,value] of Object.entries(expected)) if(valhalla[key]!==value) fail(`Valhalla ${key} does not match founder-approved copy`);
  if(valhalla.veteranOwned!==true) fail('Valhalla must be marked veteran-owned');
  if(valhalla.directlyConfirmed!==true) fail('Valhalla must be marked directly confirmed');
  if(valhalla.logo) fail('Valhalla must not hotlink or invent a logo before a canonical partner asset is stored');
  if(valhalla.businessUrl!=='https://www.valhallabarbellclubvb.com/') fail('Valhalla CTA must use the official business website');
}

for(const slug of ['yorktown-tools','compass-rose-realty-co']) if(!partners.some(partner=>partner.slug===slug)) fail(`existing featured partner regression: ${slug} missing`);

const page=read('featured.html');
for(const token of ['partnerSubheadline','militaryOfferText','partner.standard','partner.wolfLine','primaryCtaLabel','data-deal-action="get-deal"']) if(!page.includes(token)) fail(`featured.html missing rich partner renderer token: ${token}`);
if(!page.includes('Featured placement identifies a confirmed partner or noteworthy military benefit; it never improves a business’s score')) fail('featured trust disclosure changed or is missing');

if(errors.length){
  console.error('Featured partner QA failed:');
  for(const error of [...new Set(errors)]) console.error(` - ${error}`);
  process.exit(1);
}
console.log('Featured partner QA passed: Valhalla approved copy, offer, trust state, CTA, and existing partner presence verified.');
